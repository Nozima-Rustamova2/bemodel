import os

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.models.model import AcademyLesson, AcademyFaq, AdminUser
from app.schemas.academy import (
    AcademyLessonOut,
    AcademyLessonCreate,
    AcademyLessonUpdate,
    AcademyFaqOut,
    AcademyFaqCreate,
    AcademyFaqUpdate,
    ReorderItems,
)
from app.services.serializers import academy_lesson_to_out, academy_faq_to_out
from app.services.storage import storage

router = APIRouter(prefix="/api/admin/academy", tags=["admin-academy"])

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_IMAGE_SIZE_MB = 15


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


# ---------- FAQs ----------


@router.get("/faqs", response_model=list[AcademyFaqOut])
def list_faqs(db: Session = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    faqs = db.query(AcademyFaq).order_by(AcademyFaq.sort_order).all()
    return [academy_faq_to_out(f) for f in faqs]


@router.post("/faqs", response_model=AcademyFaqOut)
def create_faq(
    payload: AcademyFaqCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    max_order = db.query(AcademyFaq).count()
    faq = AcademyFaq(**payload.model_dump(), sort_order=max_order)
    db.add(faq)
    db.commit()
    db.refresh(faq)
    return academy_faq_to_out(faq)


@router.put("/faqs/{faq_id}", response_model=AcademyFaqOut)
def update_faq(
    faq_id: int,
    payload: AcademyFaqUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    faq = db.query(AcademyFaq).filter(AcademyFaq.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(faq, field, value)
    db.commit()
    db.refresh(faq)
    return academy_faq_to_out(faq)


@router.delete("/faqs/{faq_id}")
def delete_faq(
    faq_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    faq = db.query(AcademyFaq).filter(AcademyFaq.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    db.delete(faq)
    db.commit()
    return {"detail": "FAQ deleted"}


@router.post("/faqs/reorder")
def reorder_faqs(
    payload: ReorderItems,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    faqs = {f.id: f for f in db.query(AcademyFaq).all()}
    for index, faq_id in enumerate(payload.ids_in_order):
        if faq_id in faqs:
            faqs[faq_id].sort_order = index
    db.commit()
    return {"detail": "Order updated"}
