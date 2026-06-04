from fastapi import APIRouter, HTTPException, Request
from app.core.config import settings
from app.schemas.conversion import ConversionPurchaseIn
from app.services.conversion_service import fire_purchase_conversions

router = APIRouter()


@router.post("/conversions/purchase")
async def purchase_conversion(payload: ConversionPurchaseIn, request: Request):
    """
    Called by Next.js /api/orders after checkout (tokens stay on backend).
    Header: X-Internal-Secret must match SECRET_KEY.
    """
    secret = request.headers.get("X-Internal-Secret", "")
    if not settings.SECRET_KEY or secret != settings.SECRET_KEY:
        raise HTTPException(status_code=403, detail="Forbidden")

    client_ip = payload.client_ip
    if not client_ip:
        forwarded = request.headers.get("X-Forwarded-For", "")
        client_ip = forwarded.split(",")[0].strip() if forwarded else None
        if not client_ip and request.client:
            client_ip = request.client.host

    payload.client_ip = client_ip
    status = await fire_purchase_conversions(payload)
    return {"ok": True, "sent": status}
