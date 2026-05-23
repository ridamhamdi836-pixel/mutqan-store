import httpx
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.analytics import WebhookDelivery
from app.core.config import settings
from app.core.logging import logger

RETRY_SCHEDULE = [1, 5, 15, 60]  # minutes


async def retry_failed_webhooks(db: Session) -> int:
    """Retry pending/failed webhooks that are due. Returns count of queued items."""
    now = datetime.now(timezone.utc)

    pending = db.query(WebhookDelivery).filter(
        WebhookDelivery.status.in_(["pending", "failed", "retrying"]),
        WebhookDelivery.next_retry_at <= now,
        WebhookDelivery.attempts < len(RETRY_SCHEDULE) + 1,
    ).all()

    queued = 0
    for delivery in pending:
        delivery.status = "retrying"
        delivery.attempts += 1
        delivery.last_attempt_at = now

        try:
            headers = {}
            if settings.GOOGLE_SHEETS_WEBHOOK_SECRET:
                headers["X-Mutqan-Webhook-Secret"] = settings.GOOGLE_SHEETS_WEBHOOK_SECRET

            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(
                    delivery.destination,
                    json=delivery.payload,
                    headers=headers,
                )
                delivery.response_status = resp.status_code
                delivery.response_body = resp.text[:500]

                if resp.status_code < 300:
                    delivery.status = "sent"
                    logger.info("webhook_retry_success", delivery_id=str(delivery.id))
                else:
                    _schedule_next_retry(delivery, now)
                    logger.warning("webhook_retry_failed", delivery_id=str(delivery.id), status=resp.status_code)

        except Exception as e:
            delivery.error_message = str(e)[:200]
            _schedule_next_retry(delivery, now)
            logger.error("webhook_retry_error", delivery_id=str(delivery.id), error=str(e))

        queued += 1

    db.commit()
    return queued


def _schedule_next_retry(delivery: WebhookDelivery, now: datetime) -> None:
    attempt_idx = min(delivery.attempts - 1, len(RETRY_SCHEDULE) - 1)
    minutes = RETRY_SCHEDULE[attempt_idx]
    delivery.next_retry_at = now + timedelta(minutes=minutes)
    if delivery.attempts >= len(RETRY_SCHEDULE) + 1:
        delivery.status = "failed"
    else:
        delivery.status = "failed"
