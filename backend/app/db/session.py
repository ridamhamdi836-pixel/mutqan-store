from sqlalchemy import create_engine
from sqlalchemy.exc import NoSuchModuleError
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

from app.core.config import settings
from app.db.url import database_url_scheme, mask_database_url, normalize_database_url

_db_url = normalize_database_url(settings.DATABASE_URL)

if database_url_scheme(_db_url) in ("postgres",):
    raise RuntimeError(
        "DATABASE_URL uses unsupported 'postgres' dialect after normalization. "
        f"Set DATABASE_URL to postgresql+psycopg://... (current: {mask_database_url(settings.DATABASE_URL)})"
    )

try:
    engine = create_engine(
        _db_url,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
    )
except NoSuchModuleError as exc:
    raise RuntimeError(
        "Cannot load database driver. Use postgresql+psycopg:// or postgres:// in DATABASE_URL. "
        f"Normalized: {mask_database_url(settings.DATABASE_URL)}"
    ) from exc

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
