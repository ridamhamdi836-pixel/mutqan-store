from fastapi import APIRouter
from app.integrations.google_sheets import diagnose_google_sheets, BUILD_TAG
from app.core.config import settings

router = APIRouter()


@router.get("/debug/google-sheets")
async def debug_google_sheets_full():
    """
    Full Google Sheets diagnostic.
    Browser: https://api.mutqan.online/api/v1/debug/google-sheets
    """
    report = await diagnose_google_sheets(send_test_row=True)
    report["api_prefix"] = settings.API_PREFIX
    report["app_env"] = settings.APP_ENV
    return report


@router.get("/debug/ping")
def debug_ping():
    return {
        "ok": True,
        "message": "backend debug routes are live",
        "google_sheets_build": BUILD_TAG,
        "webhook_configured": bool((settings.GOOGLE_SHEETS_WEBHOOK_URL or "").strip()),
    }
