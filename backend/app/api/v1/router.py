from fastapi import APIRouter
from app.api.v1.endpoints import health, products, orders, webhooks, admin

router = APIRouter()

router.include_router(health.router, tags=["health"])
router.include_router(products.router, tags=["products"])
router.include_router(orders.router, tags=["orders"])
router.include_router(webhooks.router, tags=["webhooks"])
router.include_router(admin.router, tags=["admin"])
