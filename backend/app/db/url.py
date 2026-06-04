"""Normalize DATABASE_URL for SQLAlchemy 2 + psycopg3 (Easypanel often sends postgres://)."""

from urllib.parse import urlparse


def normalize_database_url(url: str) -> str:
    u = (url or "").strip()
    if not u:
        return u

    # Easypanel / Heroku / Railway often use postgres:// — not a valid SQLAlchemy 2 dialect
    if u.startswith("postgres://"):
        u = "postgresql+psycopg://" + u[len("postgres://") :]
    elif u.startswith("postgres+"):
        u = "postgresql+" + u[len("postgres+") :]

    # Plain postgresql:// without explicit driver → psycopg v3 (see requirements.txt)
    scheme = u.split("://", 1)[0] if "://" in u else ""
    if scheme == "postgresql":
        u = "postgresql+psycopg://" + u[len("postgresql://") :]
    elif scheme == "postgresql+psycopg2":
        u = u.replace("postgresql+psycopg2://", "postgresql+psycopg://", 1)

    return u


def database_url_scheme(url: str) -> str:
    """Dialect name SQLAlchemy will load (for health checks)."""
    normalized = normalize_database_url(url)
    if "://" not in normalized:
        return "unknown"
    return normalized.split("://", 1)[0]


def mask_database_url(url: str) -> str:
    """Safe URL for logs (hide password)."""
    normalized = normalize_database_url(url)
    try:
        parsed = urlparse(normalized)
        host = parsed.hostname or ""
        port = f":{parsed.port}" if parsed.port else ""
        db = parsed.path or ""
        user = parsed.username or ""
        return f"{parsed.scheme}://{user}:***@{host}{port}{db}"
    except Exception:
        return "<invalid-database-url>"
