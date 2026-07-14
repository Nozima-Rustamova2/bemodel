import os

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.core.config import settings as app_settings
from app.core.limiter import limiter
from app.db.database import get_db
from app.models.model import Model, PressPost, ScoutingSubmission, SiteSettings, AcademyLesson, AcademyFaq, FeaturedShoot, EditorialAlbum
from app.schemas.model import ModelOut, ModelListOut
from app.schemas.press import PressPostOut
from app.schemas.settings import SiteSettingsOut
from app.schemas.featured_shoot import FeaturedShootOut
from app.schemas.editorial import EditorialAlbumOut
from app.services.serializers import (
    model_to_out,
    model_to_list_out as _model_to_list_out,
    press_post_to_out,
    settings_to_out,
    academy_lesson_to_out,
    academy_faq_to_out,
    featured_shoot_to_out,
    editorial_album_to_out,
)
from app.services.storage import storage
from app.services.telegram import notify_new_scouting_submission

router = APIRouter(prefix="/api/public", tags=["public"])

SCOUTING_PHOTO_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
SCOUTING_MAX_PHOTOS = 4
SCOUTING_MAX_FILE_SIZE_MB = 15


@router.get("/models", response_model=list[ModelListOut])
def list_models(category: str | None = None, db: Session = Depends(get_db)):
    """List all published models, optionally filtered by category."""
    query = db.query(Model).filter(Model.is_published == True)  # noqa: E712
    if category:
        query = query.filter(Model.category == category)
    models = query.order_by(Model.sort_order, Model.name).all()
    return [_model_to_list_out(m) for m in models]


@router.get("/models/featured", response_model=list[ModelListOut])
def featured_models(db: Session = Depends(get_db)):
    models = (
        db.query(Model)
        .filter(Model.is_published == True, Model.is_featured == True)  # noqa: E712
        .order_by(Model.sort_order)
        .all()
    )
    return [_model_to_list_out(m) for m in models]


@router.get("/models/{slug}", response_model=ModelOut)
def get_model(slug: str, db: Session = Depends(get_db)):
    model = db.query(Model).filter(Model.slug == slug, Model.is_published == True).first()  # noqa: E712
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    return model_to_out(model)


@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    rows = db.query(Model.category).filter(Model.is_published == True).distinct().all()  # noqa: E712
    return sorted({r[0] for r in rows})


@router.get("/press", response_model=list[PressPostOut])
def list_press(db: Session = Depends(get_db)):
    posts = (
        db.query(PressPost)
        .filter(PressPost.is_published == True)  # noqa: E712
        .order_by(PressPost.published_at.desc())
        .all()
    )
    return [press_post_to_out(p) for p in posts]


@router.get("/settings", response_model=SiteSettingsOut)
def get_public_settings(db: Session = Depends(get_db)):
    """Homepage hero content. Returns empty fields if the director hasn't set one yet."""
    row = db.query(SiteSettings).filter(SiteSettings.id == 1).first()
    if not row:
        return SiteSettingsOut()
    return settings_to_out(row)


@router.get("/featured-shoots", response_model=list[FeaturedShootOut])
def list_featured_shoots(db: Session = Depends(get_db)):
    """The 4-slot 'Latest' homepage grid. Only returns slots that have a
    published model linked, in slot order."""
    shoots = db.query(FeaturedShoot).order_by(FeaturedShoot.sort_order).all()
    return [
        featured_shoot_to_out(s)
        for s in shoots
        if s.model and s.model.is_published
    ]


@router.get("/editorial-albums", response_model=list[EditorialAlbumOut])
def list_editorial_albums(db: Session = Depends(get_db)):
    """The 5-slot 'Editorial Stories' homepage grid. Only returns albums that
    have at least one photo, in slot order."""
    albums = db.query(EditorialAlbum).order_by(EditorialAlbum.sort_order).all()
    return [editorial_album_to_out(a) for a in albums if a.photos]


@router.get("/academy")
def get_academy(db: Session = Depends(get_db)):
    lessons = db.query(AcademyLesson).order_by(AcademyLesson.sort_order).all()
    faqs = db.query(AcademyFaq).order_by(AcademyFaq.sort_order).all()
    return {
        "lessons": [academy_lesson_to_out(l) for l in lessons],
        "faqs": [academy_faq_to_out(f) for f in faqs],
    }


@router.post("/scouting")
@limiter.limit("3/hour")
def submit_scouting(
    request: Request,
    background_tasks: BackgroundTasks,
    name: str = Form(...),
    email: str = Form(...),
    phone: str | None = Form(None),
    city: str | None = Form(None),
    birthdate: str | None = Form(None),
    height: str | None = Form(None),
    instagram: str | None = Form(None),
    message: str | None = Form(None),
    website: str | None = Form(None),  # honeypot: real users never fill this in
    photos: list[UploadFile] = File(default=[]),
    db: Session = Depends(get_db),
):
    """Public scouting/casting inquiry form. Never exposed on any public read
    endpoint — only visible to admins via /api/admin/scouting."""
    if website:
        # Bot filled the honeypot field — pretend success, do nothing.
        return {"detail": "Thanks for reaching out."}

    photo_keys = []
    for upload in photos[:SCOUTING_MAX_PHOTOS]:
        ext = os.path.splitext(upload.filename or "")[1].lower()
        if ext not in SCOUTING_PHOTO_EXTENSIONS:
            continue
        contents = upload.file.read()
        if len(contents) > SCOUTING_MAX_FILE_SIZE_MB * 1024 * 1024:
            continue
        photo_keys.append(storage.save(contents, ext, prefix="scouting/"))

    submission = ScoutingSubmission(
        name=name,
        email=email,
        phone=phone,
        city=city,
        birthdate=birthdate,
        height=height,
        instagram=instagram,
        message=message,
        submitted_photo_keys=photo_keys,
    )
    db.add(submission)
    db.commit()

    photo_urls = [storage.get_url(key) for key in photo_keys]
    admin_url = f"{app_settings.FRONTEND_URL}/admin/scouting"
    fields = {
        "name": name,
        "email": email,
        "phone": phone,
        "city": city,
        "birthdate": birthdate,
        "height": height,
        "instagram": instagram,
        "message": message,
    }
    background_tasks.add_task(notify_new_scouting_submission, fields, photo_urls, admin_url)

    return {"detail": "Thanks for reaching out. Our team will be in touch if it's a fit."}
