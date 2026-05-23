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
    client_ip: str = None,
    user_agent: str = None,
    sc_click_id: str = None,
) -> None:
    if not settings.SNAPCHAT_PIXEL_ID or not settings.SNAPCHAT_ACCESS_TOKEN:
        return

    payload = {
        "pixel_id": settings.SNAPCHAT_PIXEL_ID,
        "test_event_code": "",
        "data": [
            {
                "event_name": "PURCHASE",
                "event_time": int(time.time()),
                "event_source_url": "https://mutqan.online",
                "event_id": event_id,
                "user_data": {
                    "ph": sha256_hash(phone_e164),
                    "client_ip_address": client_ip or "",
                    "client_user_agent": user_agent or "",
                    **({"sc_click_id": sc_click_id} if sc_click_id else {}),
                },
                "custom_data": {
                    "currency": "SAR",
                    "price": str(value),
                    "transaction_id": order_number,
                },
            }
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(
                "https://tr.snapchat.com/v2/conversion",
                json=payload,
                headers={"Authorization": f"Bearer {settings.SNAPCHAT_ACCESS_TOKEN}"},
            )
            if resp.status_code >= 300:
                logger.warning("snapchat_capi_failed", status=resp.status_code)
            else:
                logger.info("snapchat_capi_sent", event_id=event_id)
    except Exception as e:
        logger.error("snapchat_capi_error", error=str(e))
