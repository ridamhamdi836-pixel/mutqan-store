import asyncio
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from uuid import UUID
from app.db.session import get_db
from app.schemas.order import (
    CreateOrderIn, CreateOrderOut,
    AcceptUpsellIn, AcceptUpsellOut,
    DeclineUpsellIn, DeclineUpsellOut,
    TrackOrderIn, TrackOrderOut,
    UpdateStatusIn, UpdateStatusOut,
)
from app.services.order_service import (
    create_order, accept_upsell, decline_upsell,
    track_order, update_order_status,
)
from app.core.security import verify_admin_key
from app.core.logging import logger
from app.schemas.conversion import ConversionPurchaseIn
from app.services.conversion_service import fire_purchase_conversions

router = APIRouter()


@router.post("/orders", response_model=CreateOrderOut)
async def place_order(payload: CreateOrderIn, request: Request, db: Session = Depends(get_db)):
    client_ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else None)
    result = create_order(db, payload, client_ip=client_ip)

    order = result["order"]
    phone_e164 = result["customer_phone_e164"]
    upsell = result["upsell"]

    # Google Sheets: handled by Next.js frontend (/api/orders) — not backend

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


async def _fire_non_sheet_integrations(db, order, phone_e164, client_ip, payload):
    tracking = payload.tracking
    if not tracking or not tracking.client_event_id:
        return

    items = order.items
    conv = ConversionPurchaseIn(
        event_id=tracking.client_event_id,
        phone_e164=phone_e164,
        value=order.total_sar,
        order_number=order.public_order_number,
        product_slugs=[i.product_slug for i in items],
        quantities=[i.quantity for i in items],
        prices=[float(i.unit_price_sar) for i in items],
        client_ip=client_ip,
        user_agent=tracking.user_agent,
        meta_fbp=tracking.meta_fbp,
        meta_fbc=tracking.meta_fbc,
        landing_page=tracking.landing_page,
        tiktok_click_id=tracking.tiktok_click_id,
        snapchat_click_id=tracking.snapchat_click_id,
    )
    await fire_purchase_conversions(conv)


@router.post("/orders/{order_id}/upsell/accept", response_model=AcceptUpsellOut)
async def accept_upsell_endpoint(order_id: UUID, payload: AcceptUpsellIn, db: Session = Depends(get_db)):
    order = accept_upsell(db, order_id, payload.offer_id)
    return {"order": order, "message_ar": "تمت إضافة العرض إلى طلبك."}


@router.post("/orders/{order_id}/upsell/decline", response_model=DeclineUpsellOut)
async def decline_upsell_endpoint(order_id: UUID, payload: DeclineUpsellIn, db: Session = Depends(get_db)):
    order = decline_upsell(db, order_id, payload.offer_id)
    return {"order": order, "message_ar": "تم تأكيد طلبك بنجاح."}


@router.post("/orders/track", response_model=TrackOrderOut)
def track_order_endpoint(payload: TrackOrderIn, db: Session = Depends(get_db)):
    return track_order(db, payload.public_order_number, payload.phone)


@router.patch("/orders/{order_id}/status", response_model=UpdateStatusOut, dependencies=[Depends(verify_admin_key)])
def update_status_endpoint(order_id: UUID, payload: UpdateStatusIn, db: Session = Depends(get_db)):
    order = update_order_status(db, order_id, payload.status, payload.note)
    return {"ok": True, "status": order.status}
