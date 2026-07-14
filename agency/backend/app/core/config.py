import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # General
    PROJECT_NAME: str = "Agency API"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-this-secret-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database (SQLite file, mounted as a docker volume so data persists)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./data/agency.db")

    # Uploaded photos are stored on disk here (also a mounted docker volume)
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./static/uploads")

    # Media storage backend: "local" (disk, for dev) or "r2" (Cloudflare R2)
    STORAGE_BACKEND: str = os.getenv("STORAGE_BACKEND", "local")
    R2_ACCOUNT_ID: str = os.getenv("R2_ACCOUNT_ID", "")
    R2_ACCESS_KEY_ID: str = os.getenv("R2_ACCESS_KEY_ID", "")
    R2_SECRET_ACCESS_KEY: str = os.getenv("R2_SECRET_ACCESS_KEY", "")
    R2_BUCKET: str = os.getenv("R2_BUCKET", "")
    # Public bucket URL or custom domain fronted by Cloudflare's CDN
    R2_PUBLIC_BASE_URL: str = os.getenv("R2_PUBLIC_BASE_URL", "")

    # Comma-separated list of allowed origins for the frontend
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")

    # Public URL of the Next.js frontend, used to build links in Telegram notifications
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # First admin account, auto-created on startup if it doesn't exist yet
    FIRST_ADMIN_EMAIL: str = os.getenv("FIRST_ADMIN_EMAIL", "admin@agency.com")
    FIRST_ADMIN_PASSWORD: str = os.getenv("FIRST_ADMIN_PASSWORD", "changeme123")

    # Telegram notifications for new scouting/"Become a Model" submissions.
    # Leave blank to disable — notify_new_scouting() no-ops if either is unset.
    TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    TELEGRAM_CHAT_ID: str = os.getenv("TELEGRAM_CHAT_ID", "")

    class Config:
        env_file = ".env"


settings = Settings()
