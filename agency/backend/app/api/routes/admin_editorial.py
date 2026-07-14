import os

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.models.model import EditorialAlbum, EditorialPhoto, AdminUser
from app.schemas.editorial import EditorialAlbumOut, EditorialAlbumUpdate
from app.schemas.academy import ReorderItems
from app.services.serializers import editorial_album_to_out
from app.services.storage import storage

router = APIRouter(prefix="/api/admin/editorial-albums", tags=["admin-editorial"])

SLOT_COUNT = 5
MAX_PHOTOS_PER_ALBUM = 10
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_IMAGE_SIZE_MB = 15


def _get_or_seed(db: Session) -> list[EditorialAlbum]:
    rows = db.query(EditorialAlbum).order_by(EditorialAlbum.sort_order).all()
    if len(rows) < SLOT_COUNT:
        existing_orders = {r.sort_order for r in rows}
        for i in range(SLOT_COUNT):
            if i not in existing_orders:
                db.add(EditorialAlbum(sort_order=i))
        db.commit()
        rows = db.query(EditorialAlbum).order_by(EditorialAlbum.sort_order).all()
    return rows


@router.get("", response_model=list[EditorialAlbumOut])
def list_albums(db: Session = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return [editorial_album_to_out(a) for a in _get_or_seed(db)]


@router.put("/{album_id}", response_model=EditorialAlbumOut)
def update_album(
    album_id: int,
    payload: EditorialAlbumUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    album = db.query(EditorialAlbum).filter(EditorialAlbum.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(album, field, value)
    db.commit()
    db.refresh(album)
    return editorial_album_to_out(album)


@router.post("/{album_id}/photos", response_model=EditorialAlbumOut)
def upload_album_photos(
    album_id: int,
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    album = db.query(EditorialAlbum).filter(EditorialAlbum.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")

    remaining = MAX_PHOTOS_PER_ALBUM - len(album.photos)
    if remaining <= 0:
        raise HTTPException(status_code=400, detail=f"This album already has the maximum of {MAX_PHOTOS_PER_ALBUM} photos.")

    max_order = max([p.sort_order for p in album.photos], default=-1)
    for i, upload in enumerate(files[:remaining]):
        ext = os.path.splitext(upload.filename or "")[1].lower()
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(status_code=400, detail=f"Unsupported file type '{ext}'.")
        contents = upload.file.read()
        size_mb = len(contents) / (1024 * 1024)
        if size_mb > MAX_IMAGE_SIZE_MB:
            raise HTTPException(status_code=400, detail=f"File too large ({size_mb:.1f}MB). Max is {MAX_IMAGE_SIZE_MB}MB.")
        key = storage.save(contents, ext, prefix="editorial/")
        db.add(EditorialPhoto(album_id=album.id, image_key=key, sort_order=max_order + 1 + i))

    db.commit()
    db.refresh(album)
    return editorial_album_to_out(album)


@router.delete("/{album_id}/photos/{photo_id}", response_model=EditorialAlbumOut)
def delete_album_photo(
    album_id: int,
    photo_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    album = db.query(EditorialAlbum).filter(EditorialAlbum.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    photo = db.query(EditorialPhoto).filter(EditorialPhoto.id == photo_id, EditorialPhoto.album_id == album_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    storage.delete(photo.image_key)
    db.delete(photo)
    db.commit()
    db.refresh(album)
    return editorial_album_to_out(album)


@router.post("/{album_id}/photos/reorder", response_model=EditorialAlbumOut)
def reorder_album_photos(
    album_id: int,
    payload: ReorderItems,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    album = db.query(EditorialAlbum).filter(EditorialAlbum.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    photos = {p.id: p for p in album.photos}
    for index, photo_id in enumerate(payload.ids_in_order):
        if photo_id in photos:
            photos[photo_id].sort_order = index
    db.commit()
    db.refresh(album)
    return editorial_album_to_out(album)
