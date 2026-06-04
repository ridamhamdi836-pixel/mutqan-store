"""Normalize DATABASE_URL for SQLAlchemy 2 + psycopg3 (Easypanel often sends postgres://)."""


def normalize_database_url(url: str) -> str:
    u = (url or "").strip()
    if not u:
        return u

    # Heroku / Easypanel legacy scheme — SQLAlchemy has no "postgres" dialect
    if u.startswith("postgres://"):
        u = "postgresql+psycopg://" + u[len("postgres://") :]
    elif u.startswith("postgresql://") and "+" not in u.split("://", 1)[0]:
        u = "postgresql+psycopg://" + u[len("postgresql://") :]

    return u
