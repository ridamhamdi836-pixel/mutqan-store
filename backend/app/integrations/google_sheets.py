import httpx
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
    items_summary = ", ".join(f"{i.name_ar} x{i.quantity}" for i in items)
    item_slugs = ",".join(i.product_slug for i in main_items)
    main_slug = main_items[0].product_slug if main_items else ""

    return {
        "event_type": event_type,
        "order_number": order.public_order_number,
        "created_at": order.created_at.isoformat() if order.created_at else "",
        "status": order.status,
        "customer_name": customer.full_name,
        "phone_e164": customer.phone_e164,
        "phone_local": customer.phone_local or "",
        "city": customer.city or "",
        "address": customer.address or "",
        "items_summary": items_summary,
        "item_slugs": item_slugs,
        "main_product_slug": main_slug,
        "subtotal_sar": order.subtotal_sar,
        "discount_sar": order.discount_sar,
        "shipping_sar": order.shipping_sar,
        "total_sar": order.total_sar,
        "payment_method": "COD",
        "utm_source": order.utm_source or "",
        "utm_medium": order.utm_medium or "",
        "utm_campaign": order.utm_campaign or "",
        "utm_content": order.utm_content or "",
        "landing_page": order.landing_page or "",
        "referrer": order.referrer or "",
        "client_event_id": order.client_event_id or "",
        "notes": "",
    }


async def send_to_google_sheets(db: Session, order: Order, event_type: str = "order_created") -> None:
    """Send order to Google Sheets webhook. Records delivery attempt in DB."""
    if not settings.GOOGLE_SHEETS_WEBHOOK_URL:
        logger.warning("google_sheets_webhook_not_configured")
        return

    payload = build_order_payload(order, event_type)

    delivery = WebhookDelivery(
        order_id=order.id,
        destination=settings.GOOGLE_SHEETS_WEBHOOK_URL,
        event_type=event_type,
        payload=payload,
        status="pending",
    )
    db.add(delivery)
    db.flush()

    try:
        headers = {}
        if settings.GOOGLE_SHEETS_WEBHOOK_SECRET:
            headers["X-Mutqan-Webhook-Secret"] = settings.GOOGLE_SHEETS_WEBHOOK_SECRET

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                settings.GOOGLE_SHEETS_WEBHOOK_URL,
                json=payload,
                headers=headers,
            )
            delivery.response_status = resp.status_code
            delivery.response_body = resp.text[:500]
            delivery.last_attempt_at = datetime.now(timezone.utc)
            delivery.attempts = 1

            if resp.status_code < 300:
                delivery.status = "sent"
                logger.info("google_sheets_webhook_sent", order_number=order.public_order_number)
            else:
                delivery.status = "failed"
                delivery.error_message = f"HTTP {resp.status_code}"
                delivery.next_retry_at = datetime.now(timezone.utc) + timedelta(minutes=1)
                logger.warning("google_sheets_webhook_failed", order_number=order.public_order_number, status=resp.status_code)

    except Exception as e:
        delivery.status = "failed"
        delivery.error_message = str(e)[:200]
        delivery.last_attempt_at = datetime.now(timezone.utc)
        delivery.attempts = 1
        delivery.next_retry_at = datetime.now(timezone.utc) + timedelta(minutes=1)
        logger.error("google_sheets_webhook_error", error=str(e), order_number=order.public_order_number)

    db.commit()
