import base64
import hashlib
import hmac
import json
import time
from typing import Optional

from app.core.config import settings

MAX_AGE_SEC = 60 * 60 * 24 * 7
SESSION_SALT = b"mutqan-admin-session-v1"


def _normalize_database_url(url: str) -> str:
    return url.strip().replace("postgresql+psycopg://", "postgresql://")


def _session_secret() -> str:
    explicit = (settings.ADMIN_SESSION_SECRET or settings.SECRET_KEY or "").strip()
    if explicit:
        return explicit
    db = (settings.DATABASE_URL or "").strip()
    if db:
        return hmac.new(
            SESSION_SALT,
            _normalize_database_url(db).encode(),
            hashlib.sha256,
        ).hexdigest()
    return ""


def admin_credentials_configured() -> bool:
    return bool(
        (settings.ADMIN_USERNAME or "").strip()
        and settings.ADMIN_PASSWORD
        and _session_secret()
    )


def verify_admin_login(username: str, password: str) -> bool:
    if not admin_credentials_configured():
        return False
    u = (settings.ADMIN_USERNAME or "").strip()
    p = settings.ADMIN_PASSWORD
    # Constant-time compare
    u_ok = hmac.compare_digest(username.strip(), u)
    p_ok = hmac.compare_digest(password, p)
    return u_ok and p_ok


def create_admin_session_token(username: str) -> str:
    secret = _session_secret()
    if not secret:
        raise ValueError("ADMIN_SESSION_SECRET or SECRET_KEY required")
    exp = int(time.time() * 1000) + MAX_AGE_SEC * 1000
    payload_obj = {"u": username.strip(), "exp": exp}
    payload = base64.urlsafe_b64encode(
        json.dumps(payload_obj, separators=(",", ":")).encode(),
    ).decode().rstrip("=")
    sig = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(sig).decode().rstrip("=")
    return f"{payload}.{sig_b64}"


def verify_admin_session_token(token: str) -> Optional[str]:
    secret = _session_secret()
    if not secret or "." not in token:
        return None
    payload, sig = token.split(".", 1)
    expected = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).digest()
    expected_b64 = base64.urlsafe_b64encode(expected).decode().rstrip("=")
    if not hmac.compare_digest(sig, expected_b64):
        return None
    try:
        pad = "=" * (-len(payload) % 4)
        data = json.loads(base64.urlsafe_b64decode(payload + pad))
        if not data.get("u") or not data.get("exp") or int(time.time() * 1000) > int(data["exp"]):
            return None
        return str(data["u"])
    except Exception:
        return None
