from fastapi import APIRouter
from app.api.v1.endpoints import health, products, orders, webhooks, debug

router = APIRouter()

router.include_router(health.router, tags=["health"])
router.include_router(debug.router, tags=["debug"])
router.include_router(products.router, tags=["products"])
router.include_router(orders.router, tags=["orders"])
router.include_router(webhooks.router, tags=["webhooks"])
