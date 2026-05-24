from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.api.v1.router import router
from app.integrations.google_sheets import BUILD_TAG, diagnose_google_sheets, send_test_payload
import time

setup_logging()

app = FastAPI(
    title="Mutqan API",
    description="متقن - Premium GCC Home Lifestyle Store API",
    version="2.0.0",
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)


@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    elapsed = round((time.time() - start) * 1000, 2)
    logger.info(
        "request",
        method=request.method,
        path=request.url.path,
        status=response.status_code,
        ms=elapsed,
    )
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_exception", error=str(exc), path=request.url.path)
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message_ar": "حدث خطأ غير متوقع. فضلاً حاول مرة أخرى.",
                "message_en": "Unexpected error. Please try again.",
            }
        },
    )


app.include_router(router, prefix=settings.API_PREFIX)


# --- Root-level aliases (work even if v1 router not deployed) ---

@app.get("/api/debug/google-sheets")
async def root_debug_google_sheets():
    """Full diagnostic — open in browser after deploy."""
    return await diagnose_google_sheets(send_test_row=True)


@app.get("/api/test-sheet")
async def root_test_sheet():
    """Quick test — sends one row to Google Sheet."""
    try:
        result = await send_test_payload()
        return {"ok": True, "build": BUILD_TAG, **result}
    except Exception as exc:
        logger.error("root_test_sheet_failed", error=str(exc))
        return {"ok": False, "build": BUILD_TAG, "error": str(exc)}


@app.get("/api/v1/test-google-sheets")
@app.post("/api/v1/test-google-sheets")
async def alias_test_google_sheets():
    """Alias for browser testing."""
    try:
        result = await send_test_payload()
        return {"ok": True, "build": BUILD_TAG, **result}
    except Exception as exc:
        return {"ok": False, "build": BUILD_TAG, "error": str(exc)}


@app.get("/api/health-deploy")
def health_deploy():
    """Verify new code is live."""
    return {
        "ok": True,
        "google_sheets_build": BUILD_TAG,
        "webhook_configured": bool((settings.GOOGLE_SHEETS_WEBHOOK_URL or "").strip()),
        "api_prefix": settings.API_PREFIX,
    }


@app.on_event("startup")
async def startup_event():
    logger.info(
        "startup",
        app=settings.APP_NAME,
        env=settings.APP_ENV,
        google_sheets_build=BUILD_TAG,
        webhook_configured=bool((settings.GOOGLE_SHEETS_WEBHOOK_URL or "").strip()),
    )

    from app.db.base import Base
    from app.db.session import engine
    Base.metadata.create_all(bind=engine)
    logger.info("database_tables_initialized")
