from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_ENV: str = "development"
    APP_NAME: str = "mutqan-api"
    API_PREFIX: str = "/api/v1"

    DATABASE_URL: str = "postgresql+psycopg://mutqan:mutqan@mutqan_database:5432/mutqan"

    CORS_ORIGINS: str = "http://localhost:3000"
    SECRET_KEY: str = "dev-secret-key"
    ADMIN_API_KEY: str = "dev-admin-key"

    # Used by Next.js admin UI on the frontend service (documented here for one .env template)
    ADMIN_USERNAME: str = ""
    ADMIN_PASSWORD: str = ""
    ADMIN_SESSION_SECRET: str = ""

    MAXMIND_ACCOUNT_ID: str = ""
    MAXMIND_LICENSE_KEY: str = ""

    GOOGLE_SHEETS_WEBHOOK_URL: str = ""
    GOOGLE_SHEETS_WEBHOOK_SECRET: str = ""

    META_PIXEL_ID: str = ""
    META_ACCESS_TOKEN: str = ""
    TIKTOK_PIXEL_CODE: str = ""
    TIKTOK_ACCESS_TOKEN: str = ""
    SNAPCHAT_PIXEL_ID: str = ""
    SNAPCHAT_ACCESS_TOKEN: str = ""

    WHATSAPP_BUSINESS_TOKEN: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""

    LOG_LEVEL: str = "INFO"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"


settings = Settings()
