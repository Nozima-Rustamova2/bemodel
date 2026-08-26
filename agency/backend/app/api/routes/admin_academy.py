import io
import os

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from PIL import Image, ImageOps
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.models.model import AcademyLesson, AcademyBrand, AdminUser
from app.schemas.academy import (
    AcademyLessonOut,
    AcademyLessonCreate,
    AcademyLessonUpdate,
    AcademyBrandOut,
    AcademyBrandUpdate,
    ReorderItems,
)
from app.services.serializers import (
    academy_lesson_to_out,
    academy_brand_to_out,
)
from app.services.storage import storage

router = APIRouter(prefix="/api/admin/academy", tags=["admin-academy"])

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_IMAGE_SIZE_MB = 15

# Logos are normalised to a common height and keep their own width, the way a
# printed logo sheet sets them. No padding canvas: a square badge and a wide
# wordmark each keep their proportions and simply take up different widths.
BRAND_TARGET_HEIGHT = 400
# A logo far wider than it is tall would otherwise dominate the whole strip.
BRAND_MAX_ASPECT = 5.0


# ---------- Lessons ----------


@router.get("/lessons", response_model=list[AcademyLessonOut])
def list_lessons(db: Session = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    lessons = db.query(AcademyLesson).order_by(AcademyLesson.sort_order).all()
    return [academy_lesson_to_out(l) for l in lessons]


@router.post("/lessons", response_model=AcademyLessonOut)
def create_lesson(
    payload: AcademyLessonCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    max_order = db.query(AcademyLesson).count()
    lesson = AcademyLesson(**payload.model_dump(), sort_order=max_order)
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return academy_lesson_to_out(lesson)


@router.put("/lessons/{lesson_id}", response_model=AcademyLessonOut)
def update_lesson(
    lesson_id: int,
    payload: AcademyLessonUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    lesson = db.query(AcademyLesson).filter(AcademyLesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(lesson, field, value)
    db.commit()
    db.refresh(lesson)
    return academy_lesson_to_out(lesson)


@router.delete("/lessons/{lesson_id}")
def delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    lesson = db.query(AcademyLesson).filter(AcademyLesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    if lesson.image_key:
        storage.delete(lesson.image_key)
    db.delete(lesson)
    db.commit()
    return {"detail": "Lesson deleted"}


@router.post("/lessons/{lesson_id}/image", response_model=AcademyLessonOut)
def upload_lesson_image(
    lesson_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    lesson = db.query(AcademyLesson).filter(AcademyLesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type '{ext}'.")
    contents = file.file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_IMAGE_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"File too large ({size_mb:.1f}MB). Max is {MAX_IMAGE_SIZE_MB}MB.")

    if lesson.image_key:
        storage.delete(lesson.image_key)
    lesson.image_key = storage.save(contents, ext, prefix="academy/")
    db.commit()
    db.refresh(lesson)
    return academy_lesson_to_out(lesson)


@router.post("/lessons/reorder")
def reorder_lessons(
    payload: ReorderItems,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    lessons = {l.id: l for l in db.query(AcademyLesson).all()}
    for index, lesson_id in enumerate(payload.ids_in_order):
        if lesson_id in lessons:
            lessons[lesson_id].sort_order = index
    db.commit()
    return {"detail": "Order updated"}


# ---------- Brands ("where our graduates work" strip) ----------


def _normalise_brand_logo(contents: bytes, ext: str) -> tuple[bytes, int, int]:
    """Trim a logo to its ink and scale it to a common height.

    Returns the PNG bytes plus its dimensions, which get stored so the front end
    can reserve the right width per logo without measuring images at runtime.
    """
    img = Image.open(io.BytesIO(contents))
    img = ImageOps.exif_transpose(img)
    img = img.convert("RGBA")

    # Brand assets often ship with generous transparent padding baked in. Trim it
    # first, or that padding becomes part of the logo's apparent size and it reads
    # as too small next to a tightly-cropped neighbour.
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)

    height = BRAND_TARGET_HEIGHT
    width = max(1, round(img.width * height / img.height))
    max_width = round(height * BRAND_MAX_ASPECT)
    if width > max_width:
        # Extremely wide art: fit by width instead so it cannot swamp the strip.
        width = max_width
        height = max(1, round(img.height * width / img.width))

    img = img.resize((width, height), Image.LANCZOS)

    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return buf.getvalue(), width, height


@router.get("/brands", response_model=list[AcademyBrandOut])
def list_brands(db: Session = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    brands = db.query(AcademyBrand).order_by(AcademyBrand.sort_order).all()
    return [academy_brand_to_out(b) for b in brands]


@router.post("/brands", response_model=AcademyBrandOut)
def create_brand(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type '{ext}'.")
    contents = file.file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_IMAGE_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"File too large ({size_mb:.1f}MB). Max is {MAX_IMAGE_SIZE_MB}MB.")

    try:
        contents, width, height = _normalise_brand_logo(contents, ext)
        ext = ".png"
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read that image file.")

    max_order = db.query(AcademyBrand).count()
    brand = AcademyBrand(
        name=os.path.splitext(file.filename or "")[0][:80] or None,
        image_key=storage.save(contents, ext, prefix="brands/"),
        width=width,
        height=height,
        sort_order=max_order,
    )
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return academy_brand_to_out(brand)


@router.put("/brands/{brand_id}", response_model=AcademyBrandOut)
def update_brand(
    brand_id: int,
    payload: AcademyBrandUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    brand = db.query(AcademyBrand).filter(AcademyBrand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(brand, field, value)
    db.commit()
    db.refresh(brand)
    return academy_brand_to_out(brand)


@router.delete("/brands/{brand_id}")
def delete_brand(
    brand_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    brand = db.query(AcademyBrand).filter(AcademyBrand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    if brand.image_key:
        storage.delete(brand.image_key)
    db.delete(brand)
    db.commit()
    return {"detail": "Brand deleted"}


@router.post("/brands/reorder")
def reorder_brands(
    payload: ReorderItems,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    brands = {b.id: b for b in db.query(AcademyBrand).all()}
    for index, brand_id in enumerate(payload.ids_in_order):
        if brand_id in brands:
            brands[brand_id].sort_order = index
    db.commit()
    return {"detail": "Order updated"}
