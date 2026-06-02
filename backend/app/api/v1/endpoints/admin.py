from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, status

from app.core.config import settings
from app.core.admin_session import (
    admin_credentials_configured,
    create_admin_session_token,
    verify_admin_login,
)

router = APIRouter(prefix="/admin")


class AdminLoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def admin_login(body: AdminLoginRequest):
    if not admin_credentials_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin credentials not configured on backend (ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SESSION_SECRET)",
        )

    if not verify_admin_login(body.username, body.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_admin_session_token(body.username)
    return {"ok": True, "username": body.username.strip(), "token": token}


@router.get("/status")
def admin_status():
    secret = (settings.ADMIN_SESSION_SECRET or settings.SECRET_KEY or "").strip()
    return {
        "configured": admin_credentials_configured(),
        "has_username": bool(settings.ADMIN_USERNAME.strip()),
        "has_password": bool(settings.ADMIN_PASSWORD),
        "has_session_secret": bool(secret),
    }
