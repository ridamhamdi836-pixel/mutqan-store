from app.integrations import meta_capi, tiktok_events, snapchat_capi
from app.core.config import settings
from app.core.logging import logger
from app.schemas.conversion import ConversionPurchaseIn


async def fire_purchase_conversions(payload: ConversionPurchaseIn) -> dict:
    """Server-side CAPI (Meta / TikTok / Snapchat) for a completed purchase."""
    status = {"meta": "skipped", "tiktok": "skipped", "snapchat": "skipped"}

    if not payload.event_id:
        logger.warning("conversion_skip_no_event_id", order=payload.order_number)
        return status

    slugs = payload.product_slugs
    quantities = payload.quantities
    prices = payload.prices

    if settings.META_PIXEL_ID and settings.META_ACCESS_TOKEN:
        try:
            await meta_capi.send_purchase_event(
            event_id=payload.event_id,
            phone_e164=payload.phone_e164,
            value=payload.value,
            order_number=payload.order_number,
            product_slugs=slugs,
            quantities=quantities,
            prices=prices,
            client_ip=payload.client_ip,
            user_agent=payload.user_agent,
            fbp=payload.meta_fbp,
            fbc=payload.meta_fbc,
            event_source_url=payload.landing_page,
        )
            status["meta"] = "sent"
        except Exception as e:
            logger.error("meta_capi_integration_error", error=str(e))
            status["meta"] = "error"

    if settings.TIKTOK_PIXEL_CODE and settings.TIKTOK_ACCESS_TOKEN:
        try:
            await tiktok_events.send_complete_payment_event(
            event_id=payload.event_id,
            phone_e164=payload.phone_e164,
            value=payload.value,
            order_number=payload.order_number,
            product_slugs=slugs,
            quantities=quantities,
            prices=prices,
            client_ip=payload.client_ip,
            user_agent=payload.user_agent,
            ttclid=payload.tiktok_click_id,
        )
            status["tiktok"] = "sent"
        except Exception as e:
            logger.error("tiktok_integration_error", error=str(e))
            status["tiktok"] = "error"

    if settings.SNAPCHAT_PIXEL_ID and settings.SNAPCHAT_ACCESS_TOKEN:
        try:
            await snapchat_capi.send_purchase_event(
            event_id=payload.event_id,
            phone_e164=payload.phone_e164,
            value=payload.value,
            order_number=payload.order_number,
            client_ip=payload.client_ip,
            user_agent=payload.user_agent,
            sc_click_id=payload.snapchat_click_id,
        )
            status["snapchat"] = "sent"
        except Exception as e:
            logger.error("snapchat_integration_error", error=str(e))
            status["snapchat"] = "error"

    return status
