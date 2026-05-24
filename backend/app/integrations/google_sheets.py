"""
Google Apps Script webhook integration.

IMPORTANT: Google Apps Script web apps often return 404 when POST uses
Content-Type: application/json. Always send JSON as text/plain body.
"""
from __future__ import annotations

import json
import traceback
from datetime import datetime, timezone, timedelta
from typing import Any

import httpx
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logging import logger
from app.models.analytics import WebhookDelivery
from app.models.order import Order

BUILD_TAG = "google-sheets-v2-text-plain"


def get_webhook_url() -> str | None:
    raw = (settings.GOOGLE_SHEETS_WEBHOOK_URL or "").strip()
    return raw or None


def validate_webhook_url(url: str) -> list[str]:
    issues: list[str] = []
    if not url:
        issues.append("GOOGLE_SHEETS_WEBHOOK_URL is empty")
        return issues
    if not url.startswith("https://script.google.com/macros/s/"):
        issues.append("URL must start with https://script.google.com/macros/s/")
    if not url.rstrip("/").endswith("/exec"):
        issues.append("URL must end with /exec (copy from Apps Script Deploy → Web app)")
    if " " in url:
        issues.append("URL contains spaces")
    return issues


def build_order_payload(order: Order, event_type: str = "order_created") -> dict[str, Any]:
    customer = order.customer
    items = order.items
    main_items = [i for i in items if i.item_type == "main"]

    order_date = order.created_at.strftime("%d/%m/%Y") if order.created_at else ""

    product_names: list[str] = []
    skus: list[str] = []
    quantities: list[str] = []

    for item in main_items:
        product_names.append(item.name_ar)
        product = item.product
        if product and getattr(product, "sku", None):
            skus.append(product.sku)
        else:
            skus.append(f"MTQ-{item.product_slug.upper()[:8]}")
        quantities.append(str(item.quantity))

    phone = ""
    if customer and customer.phone_e164:
        phone = customer.phone_e164.lstrip("+")

    return {
        "date": order_date,
        "orderid": order.public_order_number,
        "country": "KSA",
        "name": customer.full_name if customer else "",
        "phone": phone,
        # Sheet has "address" column — store order id here for tracking
        "address": order.public_order_number,
        "url": order.landing_page or "",
        "product": "/".join(product_names),
        "sku": "/".join(skus),
        "quantity": "/".join(quantities) if quantities else "1",
        "total_price": order.total_sar,
        "currency": "SAR",
        "status": "",
        "note": f"event:{event_type}",
    }


def build_test_payload() -> dict[str, Any]:
    ts = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    return {
        "date": datetime.now(timezone.utc).strftime("%d/%m/%Y"),
        "orderid": f"DEBUG-{ts}",
        "country": "KSA",
        "name": "اختبار متقن",
        "phone": "966501234567",
        "address": f"DEBUG-{ts}",
        "url": "https://mutqan.online",
        "product": "منتج تجريبي",
        "sku": "MTQ-TEST",
        "quantity": "1",
        "total_price": 1,
        "currency": "SAR",
        "status": "test",
        "note": f"debug {BUILD_TAG}",
    }


async def post_to_webhook(url: str, payload: dict[str, Any]) -> dict[str, Any]:
    body = json.dumps(payload, ensure_ascii=False)

    logger.info(
        "google_sheets_post_start",
        build=BUILD_TAG,
        url_preview=url[:72],
        payload=payload,
    )

    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        # 1) Ping doGet (optional sanity check)
        get_resp = await client.get(url)
        logger.info(
            "google_sheets_get_ping",
            status_code=get_resp.status_code,
            body_preview=(get_resp.text or "")[:200],
        )

        # 2) POST order row
        post_resp = await client.post(
            url,
            content=body,
            headers={"Content-Type": "text/plain; charset=utf-8"},
        )

    logger.info(
        "google_sheets_post_done",
        status_code=post_resp.status_code,
        body_preview=(post_resp.text or "")[:500],
    )

    parsed: Any = None
    try:
        parsed = post_resp.json()
    except Exception:
        parsed = post_resp.text[:500]

    return {
        "get_status_code": get_resp.status_code,
        "get_body_preview": (get_resp.text or "")[:300],
        "post_status_code": post_resp.status_code,
        "post_body_preview": (post_resp.text or "")[:500],
        "post_json": parsed,
        "payload_sent": payload,
    }


async def diagnose_google_sheets(send_test_row: bool = True) -> dict[str, Any]:
    """Full diagnostic report — safe to call from browser (GET)."""
    report: dict[str, Any] = {
        "ok": False,
        "build": BUILD_TAG,
        "steps": [],
    }

    url = get_webhook_url()
    report["webhook_configured"] = bool(url)
    report["webhook_url_preview"] = (url[:80] + "...") if url and len(url) > 80 else url

    issues = validate_webhook_url(url or "")
    report["steps"].append({"step": "validate_url", "issues": issues, "ok": len(issues) == 0})
    if issues:
        report["error"] = "; ".join(issues)
        return report

    assert url is not None

    try:
        if send_test_row:
            result = await post_to_webhook(url, build_test_payload())
            post_ok = 200 <= result["post_status_code"] < 300
            body_str = str(result.get("post_json", ""))
            apps_ok = "success" in body_str or post_ok

            report["steps"].append({"step": "post_test_row", "ok": apps_ok, **result})
            report["ok"] = apps_ok
        else:
            async with httpx.AsyncClient(timeout=20.0, follow_redirects=True) as client:
                get_resp = await client.get(url)
            report["steps"].append({
                "step": "get_only",
                "ok": get_resp.status_code < 400,
                "status_code": get_resp.status_code,
                "body": (get_resp.text or "")[:300],
            })
            report["ok"] = get_resp.status_code < 400

    except Exception as exc:
        tb = traceback.format_exc()
        logger.error("google_sheets_diagnose_failed", error=str(exc), traceback=tb)
        report["steps"].append({"step": "exception", "ok": False, "error": str(exc), "traceback": tb})
        report["error"] = str(exc)

    return report


async def send_test_payload() -> dict[str, Any]:
    url = get_webhook_url()
    if not url:
        raise ValueError("GOOGLE_SHEETS_WEBHOOK_URL is not configured")
    issues = validate_webhook_url(url)
    if issues:
        raise ValueError("; ".join(issues))
    result = await post_to_webhook(url, build_test_payload())
    return {"ok": 200 <= result["post_status_code"] < 300, **result}


async def send_to_google_sheets(db: Session, order: Order, event_type: str = "order_created") -> None:
    url = get_webhook_url()
    if not url:
        logger.warning(
            "google_sheets_skip_not_configured",
            order_number=order.public_order_number,
        )
        return

    url_issues = validate_webhook_url(url)
    if url_issues:
        logger.error(
            "google_sheets_invalid_url",
            order_number=order.public_order_number,
            issues=url_issues,
        )
        return

    payload = build_order_payload(order, event_type)
    logger.info(
        "google_sheets_order_send_start",
        build=BUILD_TAG,
        order_number=order.public_order_number,
        payload=payload,
    )

    delivery = WebhookDelivery(
        order_id=order.id,
        destination=url,
        event_type=event_type,
        payload=payload,
        status="pending",
    )
    db.add(delivery)
    db.flush()

    try:
        body = json.dumps(payload, ensure_ascii=False)
        async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
            resp = await client.post(
                url,
                content=body,
                headers={"Content-Type": "text/plain; charset=utf-8"},
            )

        delivery.response_status = resp.status_code
        delivery.response_body = (resp.text or "")[:500]
        delivery.last_attempt_at = datetime.now(timezone.utc)
        delivery.attempts = 1

        if resp.status_code < 300:
            delivery.status = "sent"
            logger.info(
                "google_sheets_order_sent",
                order_number=order.public_order_number,
                status_code=resp.status_code,
                response=(resp.text or "")[:300],
            )
        else:
            delivery.status = "failed"
            delivery.error_message = f"HTTP {resp.status_code}: {(resp.text or '')[:200]}"
            delivery.next_retry_at = datetime.now(timezone.utc) + timedelta(minutes=5)
            logger.warning(
                "google_sheets_order_failed",
                order_number=order.public_order_number,
                status_code=resp.status_code,
                response=(resp.text or "")[:300],
            )

    except Exception as exc:
        delivery.status = "failed"
        delivery.error_message = str(exc)[:200]
        delivery.last_attempt_at = datetime.now(timezone.utc)
        delivery.attempts = 1
        delivery.next_retry_at = datetime.now(timezone.utc) + timedelta(minutes=5)
        logger.error(
            "google_sheets_order_exception",
            order_number=order.public_order_number,
            error=str(exc),
            traceback=traceback.format_exc(),
        )

    db.commit()
