from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.api.v1.router import router
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


@app.on_event("startup")
async def startup_event():
    logger.info("startup", app=settings.APP_NAME, env=settings.APP_ENV)

    from app.db.base import Base
    from app.db.session import engine
    Base.metadata.create_all(bind=engine)
    logger.info("database_tables_initialized")
