import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.order import Customer, Order, OrderItem, OrderStatusHistory, UpsellEvent
from app.models.product import Product
from app.schemas.order import CreateOrderIn, TrackingIn
from app.services.phone_service import validate_and_normalize_saudi_phone
from app.services.pricing_service import recalculate_order_totals
from app.services.upsell_service import get_upsell_offer, get_offer_config
from app.core.logging import logger


STATUS_LABELS_AR = {
    "draft": "مسودة",
    "placed": "تم الطلب",
    "upsell_pending": "في انتظار قرار العرض",
    "confirmed": "تم تأكيد الطلب",
    "cancelled": "ملغى",
    "packed": "تم التحضير",
    "shipped": "تم الشحن",
    "out_for_delivery": "في الطريق إليك",
    "delivered": "تم التوصيل",
    "returned": "مرتجع",
    "failed_delivery": "تعذر التوصيل",
}


def generate_order_number(db: Session) -> str:
    """Generate order number with 'mutqan-' prefix and timestamp/count format.
    
    Format: mutqan-YYMMDD-XXXX where XXXX is zero-padded count for the day
    Example: mutqan-260523-0001
    """
    today = datetime.now(timezone.utc).strftime("%y%m%d")
    prefix = f"mutqan-{today}-"
    count = db.query(Order).filter(Order.public_order_number.like(f"{prefix}%")).count()
    return f"{prefix}{str(count + 1).zfill(4)}"


def get_or_create_customer(db: Session, full_name: str, phone_e164: str, phone_local: str) -> Customer:
    customer = db.query(Customer).filter(Customer.phone_e164 == phone_e164).first()
    if customer:
        customer.full_name = full_name
        customer.updated_at = datetime.now(timezone.utc)
        db.flush()
        return customer

    customer = Customer(
        full_name=full_name,
        phone_e164=phone_e164,
        phone_local=phone_local,
    )
    db.add(customer)
    db.flush()
    return customer


def create_order(db: Session, payload: CreateOrderIn, client_ip: str = None) -> dict:
    phone_e164, phone_local = validate_and_normalize_saudi_phone(payload.customer.phone)

    validated_items = recalculate_order_totals(db, payload.items)

    subtotal = sum(i["total_price_sar"] for i in validated_items)
    total = subtotal

    customer = get_or_create_customer(db, payload.customer.full_name, phone_e164, phone_local)
    order_number = generate_order_number(db)

    tracking = payload.tracking or TrackingIn()

    order = Order(
        public_order_number=order_number,
        customer_id=customer.id,
        status="upsell_pending",
        subtotal_sar=subtotal,
        discount_sar=0,
        shipping_sar=0,
        total_sar=total,
        client_event_id=tracking.client_event_id,
        landing_page=tracking.landing_page,
        referrer=tracking.referrer,
        utm_source=tracking.utm_source,
        utm_medium=tracking.utm_medium,
        utm_campaign=tracking.utm_campaign,
        utm_content=tracking.utm_content,
        utm_term=tracking.utm_term,
        meta_fbp=tracking.meta_fbp,
        meta_fbc=tracking.meta_fbc,
        tiktok_click_id=tracking.tiktok_click_id,
        snapchat_click_id=tracking.snapchat_click_id,
        user_agent=tracking.user_agent,
        ip_address=client_ip,
    )
    db.add(order)
    db.flush()

    for item_data in validated_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data["product"].id,
            product_bundle_id=item_data["bundle"].id,
            product_slug=item_data["product"].slug,
            name_ar=item_data["product"].name_ar,
            quantity=item_data["quantity"],
            unit_price_sar=item_data["unit_price_sar"],
            total_price_sar=item_data["total_price_sar"],
            item_type=item_data["item_type"],
        )
        db.add(order_item)

    db.add(OrderStatusHistory(
        order_id=order.id,
        from_status=None,
        to_status="upsell_pending",
        note="Order created",
        changed_by="system",
    ))

    # Determine upsell offer from main product
    main_slug = None
    for item_data in validated_items:
        if item_data["item_type"] == "main":
            main_slug = item_data["product"].slug
            break

    upsell_offer = None
    if main_slug:
        upsell_offer = get_upsell_offer(db, main_slug)
        if upsell_offer:
            upsell_evt = UpsellEvent(
                order_id=order.id,
                upsell_product_id=upsell_offer["product_id"],
                offer_id=upsell_offer["offer_id"],
                offered_price_sar=upsell_offer["offered_price_sar"],
                status="viewed",
            )
            db.add(upsell_evt)

    db.commit()
    db.refresh(order)

    logger.info("order_created", order_number=order_number, total=total)

    return {
        "order": order,
        "customer_phone_e164": phone_e164,
        "upsell": upsell_offer,
    }


def accept_upsell(db: Session, order_id: uuid.UUID, offer_id: str) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail={"error": {"code": "ORDER_NOT_FOUND", "message_ar": "الطلب غير موجود."}})

    if order.status not in ("upsell_pending", "placed"):
        raise HTTPException(status_code=400, detail={"error": {"code": "UPSELL_NOT_ELIGIBLE", "message_ar": "انتهت صلاحية العرض."}})

    upsell_event = db.query(UpsellEvent).filter(
        UpsellEvent.order_id == order_id,
        UpsellEvent.offer_id == offer_id,
        UpsellEvent.status == "viewed",
    ).first()

    if not upsell_event:
        raise HTTPException(status_code=400, detail={"error": {"code": "UPSELL_EXPIRED", "message_ar": "انتهت صلاحية العرض."}})

    offer_config = get_offer_config(offer_id)
    if not offer_config:
        raise HTTPException(status_code=400, detail={"error": {"code": "UPSELL_NOT_ELIGIBLE", "message_ar": "العرض غير متاح."}})

    upsell_product = db.query(Product).filter(Product.slug == offer_config["product_slug"]).first()
    if not upsell_product:
        raise HTTPException(status_code=400, detail={"error": {"code": "PRODUCT_NOT_FOUND", "message_ar": "المنتج غير متاح."}})

    upsell_item = OrderItem(
        order_id=order.id,
        product_id=upsell_product.id,
        product_slug=upsell_product.slug,
        name_ar=upsell_product.name_ar,
        quantity=1,
        unit_price_sar=upsell_event.offered_price_sar,
        total_price_sar=upsell_event.offered_price_sar,
        item_type="post_order_upsell",
    )
    db.add(upsell_item)

    order.total_sar += upsell_event.offered_price_sar
    order.subtotal_sar += upsell_event.offered_price_sar
    order.status = "placed"
    order.updated_at = datetime.now(timezone.utc)

    upsell_event.status = "accepted"
    upsell_event.responded_at = datetime.now(timezone.utc)

    db.add(OrderStatusHistory(
        order_id=order.id,
        from_status="upsell_pending",
        to_status="placed",
        note="Upsell accepted",
        changed_by="customer",
    ))

    db.commit()
    db.refresh(order)
    logger.info("upsell_accepted", order_id=str(order_id), offer_id=offer_id)
    return order


def decline_upsell(db: Session, order_id: uuid.UUID, offer_id: str) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail={"error": {"code": "ORDER_NOT_FOUND", "message_ar": "الطلب غير موجود."}})

    upsell_event = db.query(UpsellEvent).filter(
        UpsellEvent.order_id == order_id,
        UpsellEvent.offer_id == offer_id,
    ).first()

    if upsell_event and upsell_event.status == "viewed":
        upsell_event.status = "declined"
        upsell_event.responded_at = datetime.now(timezone.utc)

    if order.status == "upsell_pending":
        order.status = "placed"
        order.updated_at = datetime.now(timezone.utc)
        db.add(OrderStatusHistory(
            order_id=order.id,
            from_status="upsell_pending",
            to_status="placed",
            note="Upsell declined",
            changed_by="customer",
        ))

    db.commit()
    db.refresh(order)
    logger.info("upsell_declined", order_id=str(order_id), offer_id=offer_id)
    return order


def track_order(db: Session, public_order_number: str, phone: str) -> dict:
    from app.services.phone_service import validate_and_normalize_saudi_phone
    phone_e164, _ = validate_and_normalize_saudi_phone(phone)

    order = db.query(Order).filter(Order.public_order_number == public_order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail={"error": {"code": "ORDER_NOT_FOUND", "message_ar": "الطلب غير موجود."}})

    customer = order.customer
    if customer.phone_e164 != phone_e164:
        raise HTTPException(status_code=404, detail={"error": {"code": "ORDER_NOT_FOUND", "message_ar": "بيانات الطلب غير صحيحة."}})

    items = [{"name_ar": item.name_ar, "quantity": item.quantity} for item in order.items if item.item_type == "main"]

    return {
        "public_order_number": order.public_order_number,
        "status": order.status,
        "status_label_ar": STATUS_LABELS_AR.get(order.status, order.status),
        "estimated_delivery_ar": "عادة خلال 2-5 أيام عمل داخل المدن الرئيسية",
        "items": items,
        "total_sar": order.total_sar,
    }


def update_order_status(db: Session, order_id: uuid.UUID, new_status: str, note: str = None) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail={"error": {"code": "ORDER_NOT_FOUND", "message_ar": "الطلب غير موجود."}})

    old_status = order.status
    order.status = new_status
    order.updated_at = datetime.now(timezone.utc)

    if new_status == "confirmed":
        order.confirmed_at = datetime.now(timezone.utc)
    elif new_status == "delivered":
        order.delivered_at = datetime.now(timezone.utc)
    elif new_status == "cancelled":
        order.cancelled_at = datetime.now(timezone.utc)

    db.add(OrderStatusHistory(
        order_id=order.id,
        from_status=old_status,
        to_status=new_status,
        note=note,
        changed_by="admin",
    ))

    db.commit()
    db.refresh(order)
    return order
