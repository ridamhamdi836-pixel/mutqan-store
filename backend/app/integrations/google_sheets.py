import httpx
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.order import Order
from app.models.analytics import WebhookDelivery
from app.core.config import settings
from app.core.logging import logger


def build_order_payload(order: Order, event_type: str = "order_created") -> dict:
    """Build order payload formatted for Google Sheets webhook.
    
    Format:
    - date: DD/MM/YYYY
    - orderid: from public_order_number
    - country: always KSA
    - name: customer name
    - phone: customer phone in E.164 format (e.g., 966504752330)
    - product: product names in Arabic, separated by / if multiple
    - sku: product SKUs, separated by / if multiple
    - quantity: quantities, separated by / if multiple
    - total_price: order total in SAR
    - currency: always SAR
    - status: empty
    - note: optional note field
    """
    customer = order.customer
    items = order.items
    main_items = [i for i in items if i.item_type == "main"]
    
    # Format date as DD/MM/YYYY
    order_date = order.created_at.strftime("%d/%m/%Y") if order.created_at else ""
    
    # Collect product names, SKUs, and quantities from main items
    product_names = []
    skus = []
    quantities = []
    
    for item in main_items:
        product_names.append(item.name_ar)
        # Get SKU from product or use a default format
        product = item.product
        if product and product.sku:
            skus.append(product.sku)
        else:
            # Fallback: generate SKU from product slug if not set
            skus.append(f"MTQ-{item.product_slug.upper()}")
        quantities.append(str(item.quantity))
    
    # Join with / for multiple items
    products_str = "/".join(product_names)
    skus_str = "/".join(skus)
    quantities_str = "/".join(quantities)
    
    # Build the sheet-formatted payload
    return {
        # Legacy fields (keep for backward compatibility with existing integrations)
        "event_type": event_type,
        "order_number": order.public_order_number,
        "created_at": order.created_at.isoformat() if order.created_at else "",
        "status": order.status,
        "customer_name": customer.full_name,
        "phone_e164": customer.phone_e164,
        "phone_local": customer.phone_local or "",
        "city": customer.city or "",
        "address": customer.address or "",
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
        
        # Google Sheets specific format
        "date": order_date,
        "orderid": order.public_order_number,
        "country": "KSA",
        "name": customer.full_name,
        "phone": customer.phone_e164.lstrip("+") if customer.phone_e164 else "",  # Remove + prefix if present
        "product": products_str,
        "sku": skus_str,
        "quantity": quantities_str,
        "total_price": order.total_sar,
        "currency": "SAR",
        "status": "",  # Always empty as per user requirement
        "note": "",
    }


async def send_to_google_sheets(db: Session, order: Order, event_type: str = "order_created") -> None:
    """Send order to Google Sheets webhook. Records delivery attempt in DB."""
    if not settings.GOOGLE_SHEETS_WEBHOOK_URL:
        logger.warning(
            "google_sheets_webhook_not_configured",
            order_number=order.public_order_number,
            event_type=event_type,
        )
        return

    payload = build_order_payload(order, event_type)

    logger.info(
        "google_sheets_webhook_sending",
        order_number=order.public_order_number,
        event_type=event_type,
        url=settings.GOOGLE_SHEETS_WEBHOOK_URL,
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
            headers["X-Mutqan-Webhook-Secret"] = settings.GOOGLE_SHEETS_WEBHOOK_SECRET

        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
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
                )
            else:
                delivery.status = "failed"
                delivery.error_message = f"HTTP {resp.status_code}"
                delivery.next_retry_at = datetime.now(timezone.utc) + timedelta(minutes=1)
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
        delivery.next_retry_at = datetime.now(timezone.utc) + timedelta(minutes=1)
        logger.error("google_sheets_webhook_error", error=str(e), order_number=order.public_order_number)

    db.commit()
+
+
+async def send_test_payload() -> dict:
+    """Send a simple test payload to the configured Google Sheets webhook."""
+    if not settings.GOOGLE_SHEETS_WEBHOOK_URL:
+        logger.warning("google_sheets_webhook_not_configured_for_test")
+        raise ValueError("GOOGLE_SHEETS_WEBHOOK_URL is not configured")
+
+    payload = {
+        "date": datetime.now(timezone.utc).strftime("%d/%m/%Y"),
+        "orderid": "mutqan-test-" + datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S"),
+        "country": "KSA",
+        "name": "طلب اختبار",
+        "phone": "966501234567",
+        "product": "منتج تجريبي/منتج آخر",
+        "sku": "MTQ-TEST1/MTQ-TEST2",
+        "quantity": "1/2",
+        "total_price": 123,
+        "currency": "SAR",
+        "status": "",
+        "note": "Google Sheets webhook test payload"
+    }
+
+    async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
+        resp = await client.post(
+            settings.GOOGLE_SHEETS_WEBHOOK_URL,
+            json=payload,
+        )
+
+    logger.info(
+        "google_sheets_test_payload_sent",
+        url=settings.GOOGLE_SHEETS_WEBHOOK_URL,
+        status_code=resp.status_code,
+        orderid=payload["orderid"],
+    )
+
+    return {
+        "url": settings.GOOGLE_SHEETS_WEBHOOK_URL,
+        "status_code": resp.status_code,
+        "response_text": resp.text[:500],
+        "payload": payload,
+    }
