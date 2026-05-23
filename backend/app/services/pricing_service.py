from typing import List
from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.product import Product, ProductBundle
from app.schemas.order import OrderItemIn


def recalculate_order_totals(db: Session, items: List[OrderItemIn]) -> List[dict]:
    """
    Validates each order item against trusted DB data and recalculates totals.
    Returns list of validated item dicts with prices.
    Raises HTTPException if any item is invalid.
    """
    validated_items = []

    for item in items:
        product = db.query(Product).filter(
            Product.slug == item.product_slug,
            Product.is_active == True,
        ).first()

        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "error": {
                        "code": "PRODUCT_NOT_FOUND",
                        "message_ar": f"المنتج {item.product_slug} غير متوفر.",
                        "message_en": f"Product {item.product_slug} not found.",
                    }
                },
            )

        bundle = db.query(ProductBundle).filter(
            ProductBundle.id == item.bundle_id,
            ProductBundle.product_id == product.id,
            ProductBundle.is_active == True,
        ).first()

        if not bundle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "error": {
                        "code": "BUNDLE_NOT_FOUND",
                        "message_ar": "الباقة المحددة غير متوفرة.",
                        "message_en": "Bundle not found.",
                    }
                },
            )

        validated_items.append({
            "product": product,
            "bundle": bundle,
            "quantity": item.quantity,
            "item_type": item.item_type,
            "unit_price_sar": bundle.price_sar,
            "total_price_sar": bundle.price_sar * item.quantity,
        })

    return validated_items


def get_upsell_product_by_slug(db: Session, slug: str) -> Product | None:
    return db.query(Product).filter(
        Product.slug == slug,
        Product.is_active == True,
    ).first()
