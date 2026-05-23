from pydantic import BaseModel, field_validator
from typing import List, Optional
from uuid import UUID


class CustomerIn(BaseModel):
    full_name: str
    phone: str

    @field_validator("full_name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("الاسم قصير جدًا")
        if len(v) > 80:
            raise ValueError("الاسم طويل جدًا")
        return v


class OrderItemIn(BaseModel):
    product_slug: str
    bundle_id: UUID
    quantity: int = 1
    item_type: str = "main"


class TrackingIn(BaseModel):
    client_event_id: Optional[str] = None
    landing_page: Optional[str] = None
    referrer: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None
    meta_fbp: Optional[str] = None
    meta_fbc: Optional[str] = None
    tiktok_click_id: Optional[str] = None
    snapchat_click_id: Optional[str] = None
    user_agent: Optional[str] = None


class CreateOrderIn(BaseModel):
    customer: CustomerIn
    items: List[OrderItemIn]
    tracking: Optional[TrackingIn] = None


class UpsellOfferOut(BaseModel):
    offer_id: str
    product_slug: str
    name_ar: str
    offered_price_sar: int
    expires_in_seconds: int = 15


class OrderSummaryOut(BaseModel):
    id: UUID
    public_order_number: str
    status: str
    subtotal_sar: int
    discount_sar: int
    shipping_sar: int
    total_sar: int
    currency: str

    model_config = {"from_attributes": True}


class CustomerOut(BaseModel):
    phone_e164: str


class CreateOrderOut(BaseModel):
    order: OrderSummaryOut
    customer: CustomerOut
    upsell: Optional[UpsellOfferOut] = None


class AcceptUpsellIn(BaseModel):
    offer_id: str


class AcceptUpsellOut(BaseModel):
    order: OrderSummaryOut
    message_ar: str


class DeclineUpsellIn(BaseModel):
    offer_id: str
    reason: Optional[str] = None


class DeclineUpsellOut(BaseModel):
    order: OrderSummaryOut
    message_ar: str


class TrackOrderIn(BaseModel):
    public_order_number: str
    phone: str


class TrackOrderItemOut(BaseModel):
    name_ar: str
    quantity: int


class TrackOrderOut(BaseModel):
    public_order_number: str
    status: str
    status_label_ar: str
    estimated_delivery_ar: str
    items: List[TrackOrderItemOut]
    total_sar: int


class UpdateStatusIn(BaseModel):
    status: str
    note: Optional[str] = None


class UpdateStatusOut(BaseModel):
    ok: bool
    status: str


class ErrorOut(BaseModel):
    error: dict
