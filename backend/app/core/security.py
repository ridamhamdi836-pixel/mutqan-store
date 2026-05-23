import hashlib
from fastapi import HTTPException, Header, status
from app.core.config import settings


def verify_admin_key(x_admin_key: str = Header(...)) -> None:
    if x_admin_key != settings.ADMIN_API_KEY:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid admin key")


def hash_phone_sha256(phone_e164: str) -> str:
    """Hash phone number for conversion APIs (Meta CAPI etc.)."""
    normalized = phone_e164.strip().replace("+", "").lower()
    return hashlib.sha256(normalized.encode()).hexdigest()


def hash_value_sha256(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()
