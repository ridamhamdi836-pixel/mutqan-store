import json
import httpx
import traceback
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.analytics import WebhookDelivery
from app.core.config import settings
from app.core.logging import logger


def build_order_payload(order: Order, event_type: str = "order_created") -> dict:
    customer = order.customer
    items = order.items
    main_items = [i for i in items if i.item_type == "main"]

    order_date = order.created_at.strftime("%d/%m/%Y") if order.created_at else ""

    product_names, skus, quantities = [], [], []
    for item in main_items:
        product_names.append(item.name_ar)
        product = item.product
        if product and getattr(product, "sku", None):
            skus.append(product.sku)
        else:
            skus.append(f"MTQ-{item.product_slug.upper()[:8]}")
        quantities.append(str(item.quantity))

    return {
        "date": order_date,
        "orderid": order.public_order_number,
        "country": "KSA",
        "name": customer.full_name if customer and customer.full_name else "",
        "phone": customer.phone_e164.lstrip("+") if customer and customer.phone_e164 else "",
        "product": "/".join(product_names),
        "sku": "/".join(skus),
        "quantity": "/".join(quantities),
        "total_price": order.total_sar,
        "currency": "SAR",
        "status": "",
        "note": f"event:{event_type}",
    }


async def _post_to_google(url: str, payload: dict) -> httpx.Response:
    """
    Send payload to Google Apps Script.

    Google Apps Script rejects application/json on POST and returns 404.
    Sending as text/plain with JSON body bypasses this issue.
    follow_redirects=True ensures we follow any 302 Google may return.
    """
    body = json.dumps(payload, ensure_ascii=False)

    async with httpx.AsyncClient(timeout=25.0, follow_redirects=True) as client:
        resp = await client.post(
            url,
            content=body,
            headers={"Content-Type": "text/plain"},
        )
    return resp


async def send_to_google_sheets(db: Session, order: Order, event_type: str = "order_created") -> None:
    if not settings.GOOGLE_SHEETS_WEBHOOK_URL:
        logger.warning("google_sheets_webhook_not_configured", order_number=order.public_order_number)
        return

    webhook_url = settings.GOOGLE_SHEETS_WEBHOOK_URL.strip()
    payload = build_order_payload(order, event_type)

    logger.info(
        "google_sheets_sending",
        order_number=order.public_order_number,
        destination=webhook_url[:60],
        payload=payload,
    )

    delivery = WebhookDelivery(
        order_id=order.id,
        destination=webhook_url,
        event_type=event_type,
        payload=payload,
        status="pending",
    )
    db.add(delivery)
    db.flush()

    try:
        resp = await _post_to_google(webhook_url, payload)

        delivery.response_status = resp.status_code
        delivery.response_body = resp.text[:500]
        delivery.last_attempt_at = datetime.now(timezone.utc)
        delivery.attempts = 1

        logger.info(
            "google_sheets_response",
            order_number=order.public_order_number,
            status_code=resp.status_code,
            body_preview=resp.text[:300],
        )

        if resp.status_code < 300:
            delivery.status = "sent"
            logger.info("google_sheets_webhook_sent", order_number=order.public_order_number)
        else:
            delivery.status = "failed"
            delivery.error_message = f"HTTP {resp.status_code}: {resp.text[:200]}"
            delivery.next_retry_at = datetime.now(timezone.utc) + timedelta(minutes=5)
            logger.warning(
                "google_sheets_webhook_failed",
                order_number=order.public_order_number,
                status_code=resp.status_code,
                body=resp.text[:300],
            )

    except httpx.TimeoutException as e:
        delivery.status = "failed"
        delivery.error_message = f"timeout: {str(e)}"[:200]
        delivery.last_attempt_at = datetime.now(timezone.utc)
        delivery.attempts = 1
        delivery.next_retry_at = datetime.now(timezone.utc) + timedelta(minutes=5)
        logger.error("google_sheets_timeout", error=str(e), order_number=order.public_order_number)

    except httpx.RequestError as e:
        delivery.status = "failed"
        delivery.error_message = f"request_error: {str(e)}"[:200]
        delivery.last_attempt_at = datetime.now(timezone.utc)
        delivery.attempts = 1
        delivery.next_retry_at = datetime.now(timezone.utc) + timedelta(minutes=5)
        logger.error("google_sheets_request_error", error=str(e), traceback=traceback.format_exc())

    except Exception as e:
        delivery.status = "failed"
        delivery.error_message = str(e)[:200]
        delivery.last_attempt_at = datetime.now(timezone.utc)
        delivery.attempts = 1
        delivery.next_retry_at = datetime.now(timezone.utc) + timedelta(minutes=5)
        logger.error("google_sheets_error", error=str(e), traceback=traceback.format_exc())

    db.commit()


async def send_test_payload() -> dict:
    if not settings.GOOGLE_SHEETS_WEBHOOK_URL:
        raise ValueError("GOOGLE_SHEETS_WEBHOOK_URL is not configured")

    webhook_url = settings.GOOGLE_SHEETS_WEBHOOK_URL.strip()

    payload = {
        "date": datetime.now(timezone.utc).strftime("%d/%m/%Y"),
        "orderid": "TEST-" + datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S"),
        "country": "KSA",
        "name": "طلب اختبار",
        "phone": "966501234567",
        "product": "منتج تجريبي",
        "sku": "MTQ-TEST-001",
        "quantity": "1",
        "total_price": 249,
        "currency": "SAR",
        "status": "",
        "note": "test from backend",
    }

    logger.info("google_sheets_test_sending", destination=webhook_url[:60])

    resp = await _post_to_google(webhook_url, payload)

    logger.info(
        "google_sheets_test_result",
        status_code=resp.status_code,
        body=resp.text[:300],
    )

    return {
        "status_code": resp.status_code,
        "response_text": resp.text[:500],
        "payload_sent": payload,
        "url_used": webhook_url[:60] + "...",
    }
