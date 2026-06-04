from fastapi import APIRouter

from app.core.config import settings
from app.db.url import database_url_scheme, mask_database_url

router = APIRouter()

API_BUILD = "backend-db-url-fix-v2"


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "mutqan-api",
        "build": API_BUILD,
        "db_scheme": database_url_scheme(settings.DATABASE_URL),
        "db_url_masked": mask_database_url(settings.DATABASE_URL),
    }
