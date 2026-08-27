import io
import os

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from PIL import Image, ImageOps
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.models.model import Model, Photo, AdminUser
from app.schemas.model import PhotoOut, ReorderPhotos
from app.services.storage import storage

router = APIRouter(prefix="/api/admin/models/{model_id}/photos", tags=["admin-photos"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE_MB = 30  # raised so full-resolution originals are not rejected
MAX_DIMENSION = 3200  # resize anything larger than this, longest side


def _process_and_save(upload: UploadFile) -> tuple[str, int | None, int | None]:
    """Returns (storage key, width, height). Dimensions come back None only when
    Pillow could not open the file and the original bytes were stored as-is."""
    ext = os.path.splitext(upload.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    contents = upload.file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400, detail=f"File too large ({size_mb:.1f}MB). Max is {MAX_FILE_SIZE_MB}MB."
        )

    # Re-orient (EXIF) and downscale in memory, then hand the bytes to the
    # storage backend (local disk or R2) — never touches the filesystem directly.
    width: int | None = None
    height: int | None = None
    try:
        img = Image.open(io.BytesIO(contents))
        img = ImageOps.exif_transpose(img)
        if img.mode in ("P", "RGBA") and ext in (".jpg", ".jpeg"):
            img = img.convert("RGB")
        w, h = img.size
        longest = max(w, h)
        if longest > MAX_DIMENSION:
            scale = MAX_DIMENSION / longest
            img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
        width, height = img.size
        buf = io.BytesIO()
        save_format = "JPEG" if ext in (".jpg", ".jpeg") else (img.format or "PNG")
        img.save(buf, format=save_format, quality=92, optimize=True, subsampling=0)
        contents = buf.getvalue()
    except Exception:
        # If Pillow can't process it for any reason, keep the original bytes as-is
        pass

    return storage.save(contents, ext, prefix="photos/"), width, height


@router.post("", response_model=list[PhotoOut])
def upload_photos(
    model_id: int,
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """Upload one or more photos at once for a given model."""
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    max_order = max([p.sort_order for p in model.photos], default=-1)
    created = []
    for i, upload in enumerate(files):
        filename, width, height = _process_and_save(upload)
        is_first_ever = not model.photos and i == 0
        photo = Photo(
            model_id=model.id,
            filename=filename,
            sort_order=max_order + 1 + i,
            is_cover=is_first_ever,
            width=width,
            height=height,
        )
        db.add(photo)
        model.photos.append(photo)
        created.append(photo)

    db.commit()
    for p in created:
        db.refresh(p)

    return [
        PhotoOut(
            id=p.id,
            filename=p.filename,
            url=storage.get_url(p.filename),
            is_cover=p.is_cover,
            sort_order=p.sort_order,
            width=p.width,
            height=p.height,
        )
        for p in created
    ]


@router.delete("/{photo_id}")
def delete_photo(
    model_id: int,
    photo_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    photo = db.query(Photo).filter(Photo.id == photo_id, Photo.model_id == model_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    storage.delete(photo.filename)

    was_cover = photo.is_cover
    db.delete(photo)
    db.commit()

    if was_cover:
        next_photo = (
            db.query(Photo)
            .filter(Photo.model_id == model_id)
            .order_by(Photo.sort_order)
            .first()
        )
        if next_photo:
            next_photo.is_cover = True
            db.commit()

    return {"detail": "Photo deleted"}


@router.post("/{photo_id}/set-cover")
def set_cover_photo(
    model_id: int,
    photo_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    photos = db.query(Photo).filter(Photo.model_id == model_id).all()
    target = next((p for p in photos if p.id == photo_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="Photo not found")

    for p in photos:
        p.is_cover = p.id == photo_id
    db.commit()
    return {"detail": "Cover photo updated"}


@router.post("/reorder")
def reorder_photos(
    model_id: int,
    payload: ReorderPhotos,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    photos = {p.id: p for p in db.query(Photo).filter(Photo.model_id == model_id).all()}
    for index, photo_id in enumerate(payload.photo_ids_in_order):
        if photo_id in photos:
            photos[photo_id].sort_order = index
    db.commit()
    return {"detail": "Order updated"}
