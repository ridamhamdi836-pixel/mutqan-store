import httpx
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.order import Order
from app.models.analytics import WebhookDelivery
from app.core.config import settings
from app.core.logging import logger


def build_order_payload(order: Order, event_type: str = "order_created") -> dict:
    """Build payload for Google Sheets webhook."""

    customer = order.customer
    items = order.items

    main_items = [i for i in items if i.item_type == "main"]

    order_date = (
        order.created_at.strftime("%d/%m/%Y")
        if order.created_at
        else ""
    )

    product_names = []
    skus = []
    quantities = []

    for item in main_items:

        product_names.append(item.name_ar)

        product = item.product

        if product and getattr(product, "sku", None):
            skus.append(product.sku)
        else:
            skus.append(f"MTQ-{item.product_slug.upper()}")

        quantities.append(str(item.quantity))

    products_str = "/".join(product_names)
    skus_str = "/".join(skus)
    quantities_str = "/".join(quantities)

    return {

        # Google Sheets fields
        "date": order_date,
        "orderid": order.public_order_number,
        "country": "KSA",

        "name": (
            customer.full_name
            if customer and customer.full_name
            else ""
        ),

        "phone": (
            customer.phone_e164.lstrip("+")
            if customer and customer.phone_e164
            else ""
        ),

        "product": products_str,
        "sku": skus_str,
        "quantity": quantities_str,

        "total_price": order.total_sar,
        "currency": "SAR",

        "status": "",
        "note": "",

        # Debug info
        "event_type": event_type,
    }


async def send_to_google_sheets(
    db: Session,
    order: Order,
    event_type: str = "order_created"
) -> None:

    if not settings.GOOGLE_SHEETS_WEBHOOK_URL:

        logger.warning(
            "google_sheets_webhook_not_configured",
            order_number=order.public_order_number,
        )

        return

    payload = build_order_payload(order, event_type)

    logger.info(
        "google_sheets_webhook_sending",
        order_number=order.public_order_number,
        url=settings.GOOGLE_SHEETS_WEBHOOK_URL,
        payload=payload,
    )

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
            headers["X-Mutqan-Webhook-Secret"] = (
                settings.GOOGLE_SHEETS_WEBHOOK_SECRET
            )

        async with httpx.AsyncClient(
            timeout=20.0,
            follow_redirects=True
        ) as client:

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

            logger.info(
                "google_sheets_webhook_sent",
                order_number=order.public_order_number,
                status_code=resp.status_code,
                response_body=resp.text[:200],
            )

        else:

            delivery.status = "failed"

            delivery.error_message = (
                f"HTTP {resp.status_code}"
            )

            delivery.next_retry_at = (
                datetime.now(timezone.utc)
                + timedelta(minutes=1)
            )

            logger.warning(
                "google_sheets_webhook_failed",
                order_number=order.public_order_number,
                status_code=resp.status_code,
                response_body=resp.text[:200],
            )

    except Exception as e:

        delivery.status = "failed"

        delivery.error_message = str(e)[:200]

        delivery.last_attempt_at = datetime.now(timezone.utc)

        delivery.attempts = 1

        delivery.next_retry_at = (
            datetime.now(timezone.utc)
            + timedelta(minutes=1)
        )

        logger.error(
            "google_sheets_webhook_error",
            error=str(e),
            order_number=order.public_order_number,
        )

    db.commit()


async def send_test_payload() -> dict:

    if not settings.GOOGLE_SHEETS_WEBHOOK_URL:

        raise ValueError(
            "GOOGLE_SHEETS_WEBHOOK_URL is not configured"
        )

    payload = {
        "date": datetime.now(
            timezone.utc
        ).strftime("%d/%m/%Y"),

        "orderid": (
            "mutqan-test-"
            + datetime.now(
                timezone.utc
            ).strftime("%Y%m%d%H%M%S")
        ),

        "country": "KSA",
        "name": "طلب اختبار",
        "phone": "966501234567",

        "product": "منتج تجريبي",
        "sku": "MTQ-TEST",

        "quantity": "1",

        "total_price": 123,

        "currency": "SAR",

        "status": "",

        "note": "Google Sheets webhook test",
    }

    async with httpx.AsyncClient(
        timeout=20.0,
        follow_redirects=True
    ) as client:

        resp = await client.post(
            settings.GOOGLE_SHEETS_WEBHOOK_URL,
            json=payload,
        )

    logger.info(
        "google_sheets_test_payload_sent",
        status_code=resp.status_code,
        response_body=resp.text[:200],
    )

    return {
        "status_code": resp.status_code,
        "response_text": resp.text[:500],
        "payload": payload,
    }
