from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.routes import (
    auth,
    public,
    admin_models,
    admin_photos,
    admin_press,
    admin_scouting,
    admin_settings,
    admin_academy,
    admin_featured_shoots,
    admin_editorial,
)
from app.core.config import settings
from app.core.limiter import limiter
from app.core.security import hash_password
from app.db.database import Base, engine, SessionLocal
from app.db.migrate import run_additive_migrations
from app.models.model import AdminUser

app = FastAPI(title=settings.PROJECT_NAME)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# --- CORS: allow the Next.js frontend to call this API ---
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Create tables, apply additive migrations, seed first admin user on startup ---
Base.metadata.create_all(bind=engine)
run_additive_migrations()


def _ensure_first_admin():
    db = SessionLocal()
    try:
        existing = db.query(AdminUser).filter(AdminUser.email == settings.FIRST_ADMIN_EMAIL).first()
        if not existing:
            admin = AdminUser(
                email=settings.FIRST_ADMIN_EMAIL,
                hashed_password=hash_password(settings.FIRST_ADMIN_PASSWORD),
            )
            db.add(admin)
            db.commit()
            print(f"Created first admin user: {settings.FIRST_ADMIN_EMAIL}")
    finally:
        db.close()


_ensure_first_admin()

# --- Serve uploaded photos directly (local storage backend only; R2 serves its own URLs) ---
if settings.STORAGE_BACKEND == "local":
    import os
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    app.mount("/static", StaticFiles(directory="static"), name="static")

# --- Routers ---
app.include_router(auth.router)
app.include_router(public.router)
app.include_router(admin_models.router)
app.include_router(admin_photos.router)
app.include_router(admin_press.router)
app.include_router(admin_scouting.router)
app.include_router(admin_settings.router)
app.include_router(admin_academy.router)
app.include_router(admin_featured_shoots.router)
app.include_router(admin_editorial.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
