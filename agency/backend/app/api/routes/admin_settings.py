import os

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.models.model import SiteSettings, AdminUser
from app.schemas.settings import SiteSettingsOut, SiteSettingsUpdate
from app.services.serializers import settings_to_out
from app.services.storage import storage
from app.services.video_processing import extract_poster

router = APIRouter(prefix="/api/admin/settings", tags=["admin-settings"])

ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".mov", ".webm"}
MAX_VIDEO_SIZE_MB = 100

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_IMAGE_SIZE_MB = 15

# Named settings image slots -> the SQLAlchemy column storing their storage key.
IMAGE_SLOTS = {
    "academy-about": "academy_about_image_key",
    "cta": "cta_image_key",
}

# Named settings video slots -> (video key column, poster key column).
VIDEO_SLOTS = {
    "hero": ("hero_video_key", "hero_poster_key"),
    "academy": ("academy_hero_video_key", "academy_hero_poster_key"),
}


def _get_or_create(db: Session) -> SiteSettings:
    row = db.query(SiteSettings).filter(SiteSettings.id == 1).first()
    if not row:
        row = SiteSettings(id=1)
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


@router.get("", response_model=SiteSettingsOut)
def get_settings(db: Session = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return settings_to_out(_get_or_create(db))


@router.put("", response_model=SiteSettingsOut)
def update_settings(
    payload: SiteSettingsUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    row = _get_or_create(db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return settings_to_out(row)


@router.post("/hero-video", response_model=SiteSettingsOut)
def upload_hero_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_VIDEO_EXTENSIONS)}",
        )
    contents = file.file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_VIDEO_SIZE_MB:
        raise HTTPException(
            status_code=400, detail=f"File too large ({size_mb:.1f}MB). Max is {MAX_VIDEO_SIZE_MB}MB."
        )

    row = _get_or_create(db)
    if row.hero_video_key:
        storage.delete(row.hero_video_key)
    if row.hero_poster_key:
        storage.delete(row.hero_poster_key)

    row.hero_video_key = storage.save(contents, ext, prefix="hero/")
    poster_bytes = extract_poster(contents, ext)
    row.hero_poster_key = storage.save(poster_bytes, ".jpg", prefix="hero/") if poster_bytes else None

    db.commit()
    db.refresh(row)
    return settings_to_out(row)


@router.delete("/hero-video", response_model=SiteSettingsOut)
def delete_hero_video(db: Session = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    row = _get_or_create(db)
    if row.hero_video_key:
        storage.delete(row.hero_video_key)
    if row.hero_poster_key:
        storage.delete(row.hero_poster_key)
    row.hero_video_key = None
    row.hero_poster_key = None
    db.commit()
    db.refresh(row)
    return settings_to_out(row)


@router.post("/video/{slot}", response_model=SiteSettingsOut)
def upload_settings_video(
    slot: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    if slot not in VIDEO_SLOTS:
        raise HTTPException(status_code=404, detail=f"Unknown video slot '{slot}'.")

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_VIDEO_EXTENSIONS)}",
        )
    contents = file.file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_VIDEO_SIZE_MB:
        raise HTTPException(
            status_code=400, detail=f"File too large ({size_mb:.1f}MB). Max is {MAX_VIDEO_SIZE_MB}MB."
        )

    row = _get_or_create(db)
    video_column, poster_column = VIDEO_SLOTS[slot]
    if getattr(row, video_column):
        storage.delete(getattr(row, video_column))
    if getattr(row, poster_column):
        storage.delete(getattr(row, poster_column))

    setattr(row, video_column, storage.save(contents, ext, prefix="hero/"))
    poster_bytes = extract_poster(contents, ext)
    setattr(row, poster_column, storage.save(poster_bytes, ".jpg", prefix="hero/") if poster_bytes else None)

    db.commit()
    db.refresh(row)
    return settings_to_out(row)


@router.delete("/video/{slot}", response_model=SiteSettingsOut)
def delete_settings_video(
    slot: str,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    if slot not in VIDEO_SLOTS:
        raise HTTPException(status_code=404, detail=f"Unknown video slot '{slot}'.")

    row = _get_or_create(db)
    video_column, poster_column = VIDEO_SLOTS[slot]
    if getattr(row, video_column):
        storage.delete(getattr(row, video_column))
    if getattr(row, poster_column):
        storage.delete(getattr(row, poster_column))
    setattr(row, video_column, None)
    setattr(row, poster_column, None)
    db.commit()
    db.refresh(row)
    return settings_to_out(row)


@router.post("/image/{slot}", response_model=SiteSettingsOut)
def upload_settings_image(
    slot: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    if slot not in IMAGE_SLOTS:
        raise HTTPException(status_code=404, detail=f"Unknown image slot '{slot}'.")

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type '{ext}'.")
    contents = file.file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_IMAGE_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"File too large ({size_mb:.1f}MB). Max is {MAX_IMAGE_SIZE_MB}MB.")

    row = _get_or_create(db)
    column = IMAGE_SLOTS[slot]
    old_key = getattr(row, column)
    if old_key:
        storage.delete(old_key)
    setattr(row, column, storage.save(contents, ext, prefix="settings/"))
    db.commit()
    db.refresh(row)
    return settings_to_out(row)


@router.delete("/image/{slot}", response_model=SiteSettingsOut)
def delete_settings_image(
    slot: str,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    if slot not in IMAGE_SLOTS:
        raise HTTPException(status_code=404, detail=f"Unknown image slot '{slot}'.")

    row = _get_or_create(db)
    column = IMAGE_SLOTS[slot]
    old_key = getattr(row, column)
    if old_key:
        storage.delete(old_key)
    setattr(row, column, None)
    db.commit()
    db.refresh(row)
    return settings_to_out(row)
