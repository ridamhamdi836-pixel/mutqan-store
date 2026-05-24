import asyncio
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.db.session import get_db
from app.schemas.order import (
    CreateOrderIn, CreateOrderOut, OrderSummaryOut,
    AcceptUpsellIn, AcceptUpsellOut,
    DeclineUpsellIn, DeclineUpsellOut,
    TrackOrderIn, TrackOrderOut,
    UpdateStatusIn, UpdateStatusOut,
)
from app.services.order_service import (
    create_order, accept_upsell, decline_upsell,
    track_order, update_order_status,
)
from app.integrations.google_sheets import send_to_google_sheets
from app.integrations import meta_capi, tiktok_events, snapchat_capi
from app.core.security import verify_admin_key
from app.core.logging import logger

router = APIRouter()


@router.post("/orders", response_model=CreateOrderOut)
async def place_order(payload: CreateOrderIn, request: Request, db: Session = Depends(get_db)):
    client_ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else None)
    result = create_order(db, payload, client_ip=client_ip)

    order = result["order"]
    phone_e164 = result["customer_phone_e164"]
    upsell = result["upsell"]

    try:
        await send_to_google_sheets(db, order, "order_created")
    except Exception as e:
        logger.error("sheets_integration_error", error=str(e), order_number=order.public_order_number)

    asyncio.create_task(_fire_non_sheet_integrations(db, order, phone_e164, client_ip, payload))

    upsell_out = None
    if upsell:
        upsell_out = {
            "offer_id": upsell["offer_id"],
            "product_slug": upsell["product_slug"],
            "name_ar": upsell["name_ar"],
            "offered_price_sar": upsell["offered_price_sar"],
            "expires_in_seconds": upsell["expires_in_seconds"],
        }

    return {
        "order": order,
        "customer": {"phone_e164": phone_e164},
        "upsell": upsell_out,
    }


@router.get("/test-google-sheets")
@router.post("/test-google-sheets")
async def test_google_sheets_endpoint():
    """Send a test row to Google Sheets. GET works from the browser."""
    try:
        from app.integrations.google_sheets import diagnose_google_sheets
        report = await diagnose_google_sheets(send_test_row=True)
        if not report.get("ok"):
            raise HTTPException(status_code=500, detail=report)
        return report
    except HTTPException:
        raise
    except Exception as e:
        logger.error("test_google_sheets_error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


async def _fire_non_sheet_integrations(db, order, phone_e164, client_ip, payload):
    """Fire non-sheet integrations asynchronously - failures must not affect order."""
    try:
        tracking = payload.tracking
        items = order.items
        slugs = [i.product_slug for i in items]
        quantities = [i.quantity for i in items]
        prices = [i.unit_price_sar for i in items]

        if tracking and tracking.client_event_id:
            await meta_capi.send_purchase_event(
                event_id=tracking.client_event_id,
                phone_e164=phone_e164,
                value=order.total_sar,
                order_number=order.public_order_number,
                product_slugs=slugs,
                quantities=quantities,
                prices=prices,
                client_ip=client_ip,
                user_agent=tracking.user_agent,
                fbp=tracking.meta_fbp,
                fbc=tracking.meta_fbc,
                event_source_url=tracking.landing_page,
            )
    except Exception as e:
        logger.error("meta_capi_integration_error", error=str(e))

    try:
        if tracking and tracking.client_event_id:
            await tiktok_events.send_complete_payment_event(
                event_id=tracking.client_event_id,
                phone_e164=phone_e164,
                value=order.total_sar,
                order_number=order.public_order_number,
                product_slugs=slugs,
                quantities=quantities,
                prices=prices,
                client_ip=client_ip,
                user_agent=tracking.user_agent,
                ttclid=tracking.tiktok_click_id,
            )
    except Exception as e:
        logger.error("tiktok_integration_error", error=str(e))

    try:
        if tracking and tracking.client_event_id:
            await snapchat_capi.send_purchase_event(
                event_id=tracking.client_event_id,
                phone_e164=phone_e164,
                value=order.total_sar,
                order_number=order.public_order_number,
                client_ip=client_ip,
                user_agent=tracking.user_agent,
                sc_click_id=tracking.snapchat_click_id,
            )
    except Exception as e:
        logger.error("snapchat_integration_error", error=str(e))


@router.post("/orders/{order_id}/upsell/accept", response_model=AcceptUpsellOut)
async def accept_upsell_endpoint(order_id: UUID, payload: AcceptUpsellIn, db: Session = Depends(get_db)):
    order = accept_upsell(db, order_id, payload.offer_id)
    try:
        await send_to_google_sheets(db, order, "upsell_accepted")
    except Exception as e:
        logger.error("sheets_upsell_error", error=str(e))
    return {"order": order, "message_ar": "تمت إضافة العرض إلى طلبك."}


@router.post("/orders/{order_id}/upsell/decline", response_model=DeclineUpsellOut)
async def decline_upsell_endpoint(order_id: UUID, payload: DeclineUpsellIn, db: Session = Depends(get_db)):
    order = decline_upsell(db, order_id, payload.offer_id)
    try:
        await send_to_google_sheets(db, order, "order_created")
    except Exception as e:
        logger.error("sheets_decline_error", error=str(e))
    return {"order": order, "message_ar": "تم تأكيد طلبك بنجاح."}


@router.post("/orders/track", response_model=TrackOrderOut)
def track_order_endpoint(payload: TrackOrderIn, db: Session = Depends(get_db)):
    return track_order(db, payload.public_order_number, payload.phone)


@router.patch("/orders/{order_id}/status", response_model=UpdateStatusOut, dependencies=[Depends(verify_admin_key)])
def update_status_endpoint(order_id: UUID, payload: UpdateStatusIn, db: Session = Depends(get_db)):
    order = update_order_status(db, order_id, payload.status, payload.note)
    return {"ok": True, "status": order.status}
