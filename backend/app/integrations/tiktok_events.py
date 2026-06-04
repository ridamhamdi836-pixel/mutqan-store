import httpx
import hashlib
import time
from app.core.config import settings
from app.core.logging import logger


def sha256_hash(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()


async def send_complete_payment_event(
    event_id: str,
    phone_e164: str,
    value: int,
    order_number: str,
    product_slugs: list[str],
    quantities: list[int],
    prices: list[float],
    client_ip: str = None,
    user_agent: str = None,
    ttclid: str = None,
) -> None:
    if not settings.TIKTOK_PIXEL_CODE or not settings.TIKTOK_ACCESS_TOKEN:
        logger.info("tiktok_events_skipped", reason="missing_pixel_or_token")
        return

    contents = [
        {"content_id": slug, "quantity": qty, "price": price}
        for slug, qty, price in zip(product_slugs, quantities, prices)
    ]

    user: dict = {"phone_number": sha256_hash(phone_e164)}
    if ttclid:
        user["ttclid"] = ttclid

    payload = {
        "event_source": "web",
        "event_source_id": settings.TIKTOK_PIXEL_CODE,
        "data": [
            {
                "event": "CompletePayment",
                "event_time": int(time.time()),
                "event_id": event_id,
                "user": user,
                "properties": {
                    "currency": "SAR",
                    "value": value,
                    "contents": contents,
                    "order_id": order_number,
                },
            }
        ],
    }

    if client_ip or user_agent:
        payload["data"][0]["context"] = {
            "ip": client_ip or "",
            "user_agent": user_agent or "",
        }

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(
                "https://business-api.tiktok.com/open_api/v1.3/event/track/",
                json=payload,
                headers={"Access-Token": settings.TIKTOK_ACCESS_TOKEN},
            )
            if resp.status_code >= 300:
                logger.warning(
                    "tiktok_events_failed",
                    status=resp.status_code,
                    body=resp.text[:300],
                )
            else:
                logger.info("tiktok_events_sent", event_id=event_id)
    except Exception as e:
        logger.error("tiktok_events_error", error=str(e))
