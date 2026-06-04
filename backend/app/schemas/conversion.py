from pydantic import BaseModel
from typing import Optional


class ConversionPurchaseIn(BaseModel):
    event_id: str
    phone_e164: str
    value: int
    order_number: str
    product_slugs: list[str] = []
    quantities: list[int] = []
    prices: list[float] = []
    client_ip: Optional[str] = None
    user_agent: Optional[str] = None
    meta_fbp: Optional[str] = None
    meta_fbc: Optional[str] = None
    landing_page: Optional[str] = None
    tiktok_click_id: Optional[str] = None
    snapchat_click_id: Optional[str] = None
