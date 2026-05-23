from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID


class ProductBundleOut(BaseModel):
    id: UUID
    label_ar: str
    quantity: int
    price_sar: int
    compare_at_price_sar: Optional[int] = None
    savings_label_ar: Optional[str] = None
    is_default: bool
    sort_order: int

    model_config = {"from_attributes": True}


class ProductOut(BaseModel):
    id: UUID
    slug: str
    name_ar: str
    name_en: Optional[str] = None
    short_description_ar: str
    positioning: Optional[str] = None
    category_slug: str
    bundles: List[ProductBundleOut] = []

    model_config = {"from_attributes": True}


class ProductsListOut(BaseModel):
    products: List[ProductOut]
