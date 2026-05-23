import httpx
import hashlib
import time
from app.core.config import settings
from app.core.logging import logger


def sha256_hash(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()


async def send_purchase_event(
    event_id: str,
    phone_e164: str,
    value: int,
    order_number: str,
    product_slugs: list[str],
    quantities: list[int],
    prices: list[float],
    client_ip: str = None,
    user_agent: str = None,
    fbp: str = None,
    fbc: str = None,
    event_source_url: str = None,
) -> None:
    if not settings.META_PIXEL_ID or not settings.META_ACCESS_TOKEN:
        return

    contents = [
        {"id": slug, "quantity": qty, "item_price": price}
        for slug, qty, price in zip(product_slugs, quantities, prices)
    ]

    user_data: dict = {"ph": [sha256_hash(phone_e164)]}
    if client_ip:
        user_data["client_ip_address"] = client_ip
    if user_agent:
        user_data["client_user_agent"] = user_agent
    if fbp:
        user_data["fbp"] = fbp
    if fbc:
        user_data["fbc"] = fbc

    payload = {
        "data": [
            {
                "event_name": "Purchase",
                "event_time": int(time.time()),
                "event_id": event_id,
                "action_source": "website",
                "event_source_url": event_source_url or "https://mutqan.online",
                "user_data": user_data,
                "custom_data": {
                    "currency": "SAR",
                    "value": value,
                    "content_type": "product",
                    "contents": contents,
                    "order_id": order_number,
                },
            }
        ]
    }

    url = f"https://graph.facebook.com/v21.0/{settings.META_PIXEL_ID}/events"
    params = {"access_token": settings.META_ACCESS_TOKEN}

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(url, json=payload, params=params)
            if resp.status_code >= 300:
                logger.warning("meta_capi_failed", status=resp.status_code, body=resp.text[:200])
            else:
                logger.info("meta_capi_sent", event_id=event_id, order=order_number)
    except Exception as e:
        logger.error("meta_capi_error", error=str(e))
