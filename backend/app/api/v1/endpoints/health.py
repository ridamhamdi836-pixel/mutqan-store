from fastapi import APIRouter

from app.core.config import settings
from app.db.url import normalize_database_url

router = APIRouter()


@router.get("/health")
def health_check():
    db = normalize_database_url(settings.DATABASE_URL)
    return {
        "status": "ok",
        "service": "mutqan-api",
        "db_driver": "postgresql+psycopg" if "+psycopg" in db else "other",
    }
