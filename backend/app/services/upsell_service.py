from typing import Optional
from sqlalchemy.orm import Session
from app.models.product import Product


# Upsell offer matrix: main product slug -> upsell product slug + discount price
UPSELL_MATRIX: dict[str, dict] = {
    "powerful-cordless-vacuum": {
        "product_slug": "pure-faucet-filter",
        "offered_price_sar": 149,
        "offer_id": "faucet-filter-after-vacuum",
    },
    "smart-stackable-cabinet": {
        "product_slug": "pull-out-cabinet-drawer",
        "offered_price_sar": 269,
        "offer_id": "pull-out-drawer-after-cabinet",
    },
    "pull-out-cabinet-drawer": {
        "product_slug": "sink-organizer",
        "offered_price_sar": 179,
        "offer_id": "under-sink-after-pull-out",
    },
    "sink-organizer": {
        "product_slug": "pull-out-cabinet-drawer",
        "offered_price_sar": 269,
        "offer_id": "pull-out-drawer-after-under-sink",
    },
    "pure-faucet-filter": {
        "product_slug": "sink-organizer",
        "offered_price_sar": 179,
        "offer_id": "under-sink-after-faucet-filter",
    },
    "smart-table-warmer": {
        "product_slug": "thermal-lunch-box",
        "offered_price_sar": 179,
        "offer_id": "lunch-box-after-table-warmer",
    },
    "thermal-lunch-box": {
        "product_slug": "smart-table-warmer",
        "offered_price_sar": 199,
        "offer_id": "table-warmer-after-lunch-box",
    },
}


def get_upsell_offer(db: Session, main_product_slug: str) -> Optional[dict]:
    """Returns upsell offer details for the given main product, or None."""
    offer_config = UPSELL_MATRIX.get(main_product_slug)
    if not offer_config:
        return None

    product = db.query(Product).filter(
        Product.slug == offer_config["product_slug"],
        Product.is_active == True,
    ).first()

    if not product:
        return None

    return {
        "offer_id": offer_config["offer_id"],
        "product_slug": product.slug,
        "name_ar": product.name_ar,
        "product_id": product.id,
        "offered_price_sar": offer_config["offered_price_sar"],
        "expires_in_seconds": 15,
    }


def get_offer_config(offer_id: str) -> Optional[dict]:
    for slug, config in UPSELL_MATRIX.items():
        if config["offer_id"] == offer_id:
            return {**config, "main_slug": slug}
    return None
