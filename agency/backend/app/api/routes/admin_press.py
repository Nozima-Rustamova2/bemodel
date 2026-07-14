import os
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.core.utils import slugify
from app.db.database import get_db
from app.models.model import PressPost, AdminUser
from app.schemas.press import PressPostCreate, PressPostUpdate, PressPostOut
from app.services.serializers import press_post_to_out
from app.services.storage import storage

router = APIRouter(prefix="/api/admin/press", tags=["admin-press"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE_MB = 15


def _unique_slug(db: Session, title: str, exclude_id: int | None = None) -> str:
    base = slugify(title)
    slug = base
    i = 1
    while True:
        query = db.query(PressPost).filter(PressPost.slug == slug)
        if exclude_id:
            query = query.filter(PressPost.id != exclude_id)
        if not query.first():
            return slug
        i += 1
        slug = f"{base}-{i}"


@router.get("", response_model=list[PressPostOut])
def list_all_press(
    db: Session = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)
):
    """List every press post, published or not, for the admin dashboard."""
    posts = db.query(PressPost).order_by(PressPost.created_at.desc()).all()
    return [press_post_to_out(p) for p in posts]


@router.get("/{post_id}", response_model=PressPostOut)
def get_press(
    post_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    post = db.query(PressPost).filter(PressPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Press post not found")
    return press_post_to_out(post)


@router.post("", response_model=PressPostOut)
def create_press(
    payload: PressPostCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    slug = _unique_slug(db, payload.title)
    data = payload.model_dump()
    is_published = data.pop("is_published")
    post = PressPost(
        slug=slug,
        is_published=is_published,
        published_at=datetime.utcnow() if is_published else None,
        **data,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return press_post_to_out(post)


@router.put("/{post_id}", response_model=PressPostOut)
def update_press(
    post_id: int,
    payload: PressPostUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    post = db.query(PressPost).filter(PressPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Press post not found")

    data = payload.model_dump(exclude_unset=True)
    if "title" in data and data["title"] != post.title:
        post.slug = _unique_slug(db, data["title"], exclude_id=post.id)

    was_published = post.is_published
    for field, value in data.items():
        setattr(post, field, value)
    if post.is_published and not was_published:
        post.published_at = datetime.utcnow()

    db.commit()
    db.refresh(post)
    return press_post_to_out(post)


@router.delete("/{post_id}")
def delete_press(
    post_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    post = db.query(PressPost).filter(PressPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Press post not found")
    if post.cover_key:
        storage.delete(post.cover_key)
    db.delete(post)
    db.commit()
    return {"detail": "Press post deleted"}


@router.post("/{post_id}/cover", response_model=PressPostOut)
def upload_cover(
    post_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    post = db.query(PressPost).filter(PressPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Press post not found")

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )
    contents = file.file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400, detail=f"File too large ({size_mb:.1f}MB). Max is {MAX_FILE_SIZE_MB}MB."
        )

    if post.cover_key:
        storage.delete(post.cover_key)
    post.cover_key = storage.save(contents, ext, prefix="press/")
    db.commit()
    db.refresh(post)
    return press_post_to_out(post)
