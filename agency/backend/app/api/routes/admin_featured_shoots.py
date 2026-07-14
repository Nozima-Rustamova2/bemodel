import os

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.models.model import FeaturedShoot, AdminUser
from app.schemas.featured_shoot import FeaturedShootOut, FeaturedShootUpdate
from app.services.serializers import featured_shoot_to_out
from app.services.storage import storage

router = APIRouter(prefix="/api/admin/featured-shoots", tags=["admin-featured-shoots"])

SLOT_COUNT = 4
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_IMAGE_SIZE_MB = 15


def _get_or_seed(db: Session) -> list[FeaturedShoot]:
    rows = db.query(FeaturedShoot).order_by(FeaturedShoot.sort_order).all()
    if len(rows) < SLOT_COUNT:
        existing_orders = {r.sort_order for r in rows}
        for i in range(SLOT_COUNT):
            if i not in existing_orders:
                db.add(FeaturedShoot(sort_order=i))
        db.commit()
        rows = db.query(FeaturedShoot).order_by(FeaturedShoot.sort_order).all()
    return rows


@router.get("", response_model=list[FeaturedShootOut])
def list_featured_shoots(db: Session = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return [featured_shoot_to_out(s) for s in _get_or_seed(db)]


@router.put("/{shoot_id}", response_model=FeaturedShootOut)
def update_featured_shoot(
    shoot_id: int,
    payload: FeaturedShootUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    shoot = db.query(FeaturedShoot).filter(FeaturedShoot.id == shoot_id).first()
    if not shoot:
        raise HTTPException(status_code=404, detail="Featured shoot slot not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(shoot, field, value)
    db.commit()
    db.refresh(shoot)
    return featured_shoot_to_out(shoot)


@router.post("/{shoot_id}/photo", response_model=FeaturedShootOut)
def upload_featured_shoot_photo(
    shoot_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    shoot = db.query(FeaturedShoot).filter(FeaturedShoot.id == shoot_id).first()
    if not shoot:
        raise HTTPException(status_code=404, detail="Featured shoot slot not found")

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type '{ext}'.")
    contents = file.file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_IMAGE_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"File too large ({size_mb:.1f}MB). Max is {MAX_IMAGE_SIZE_MB}MB.")

    if shoot.image_key:
        storage.delete(shoot.image_key)
    shoot.image_key = storage.save(contents, ext, prefix="featured/")
    db.commit()
    db.refresh(shoot)
    return featured_shoot_to_out(shoot)


@router.delete("/{shoot_id}/photo", response_model=FeaturedShootOut)
def delete_featured_shoot_photo(
    shoot_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    shoot = db.query(FeaturedShoot).filter(FeaturedShoot.id == shoot_id).first()
    if not shoot:
        raise HTTPException(status_code=404, detail="Featured shoot slot not found")
    if shoot.image_key:
        storage.delete(shoot.image_key)
    shoot.image_key = None
    db.commit()
    db.refresh(shoot)
    return featured_shoot_to_out(shoot)
