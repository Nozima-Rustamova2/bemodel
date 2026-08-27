from app.models.model import (
    Model,
    PressPost,
    ScoutingSubmission,
    SiteSettings,
    AcademyLesson,
    AcademyBrand,
    FeaturedShoot,
)
from app.schemas.model import ModelOut, ModelListOut, PhotoOut
from app.schemas.press import PressPostOut
from app.schemas.scouting import ScoutingSubmissionOut
from app.schemas.settings import SiteSettingsOut
from app.schemas.academy import AcademyLessonOut, AcademyBrandOut
from app.schemas.featured_shoot import FeaturedShootOut
from app.services.storage import storage


def model_to_out(model: Model) -> ModelOut:
    """
    Convert a SQLAlchemy Model (with its photos relationship) into the
    ModelOut API schema. Built field-by-field rather than via
    ModelOut.model_validate(model) directly, because the ORM's Photo
    objects don't have a `url` attribute (it's a computed field), which
    breaks automatic nested validation.
    """
    photos = [
        PhotoOut(
            id=p.id,
            filename=p.filename,
            url=storage.get_url(p.filename),
            is_cover=p.is_cover,
            sort_order=p.sort_order,
            width=p.width,
            height=p.height,
        )
        for p in sorted(model.photos, key=lambda p: p.sort_order)
    ]

    return ModelOut(
        id=model.id,
        slug=model.slug,
        name=model.name,
        category=model.category,
        bio=model.bio,
        height=model.height,
        bust=model.bust,
        waist=model.waist,
        hips=model.hips,
        shoes=model.shoes,
        eyes=model.eyes,
        hair=model.hair,
        is_published=model.is_published,
        sort_order=model.sort_order,
        created_at=model.created_at,
        photos=photos,
    )


# The roster card swaps between the first two portfolio photos on hover, so two
# is all it needs — no reason to ship the whole portfolio with the listing.
ROSTER_PREVIEW_PHOTOS = 2


def model_portfolio_photos(model: Model):
    """Everything but the cover, in sort order.

    The cover is the model page's main photo and does not appear on the roster,
    so the card previews start at the first portfolio shot.
    """
    return [p for p in sorted(model.photos, key=lambda p: p.sort_order) if not p.is_cover]


def model_cover_url(model: Model) -> str | None:
    cover = next((p for p in model.photos if p.is_cover), None)
    if not cover and model.photos:
        cover = model.photos[0]
    return storage.get_url(cover.filename) if cover else None


def model_to_list_out(model: Model) -> ModelListOut:
    return ModelListOut(
        id=model.id,
        slug=model.slug,
        name=model.name,
        category=model.category,
        height=model.height,
        bust=model.bust,
        waist=model.waist,
        hips=model.hips,
        shoes=model.shoes,
        hair=model.hair,
        eyes=model.eyes,
        is_published=model.is_published,
        cover_photo_url=model_cover_url(model),
        preview_photo_urls=[
            storage.get_url(p.filename) for p in model_portfolio_photos(model)[:ROSTER_PREVIEW_PHOTOS]
        ],
    )


def featured_shoot_to_out(shoot: FeaturedShoot) -> FeaturedShootOut:
    return FeaturedShootOut(
        id=shoot.id,
        sort_order=shoot.sort_order,
        model_id=shoot.model_id,
        credit=shoot.credit,
        image_url=storage.get_url(shoot.image_key) if shoot.image_key else None,
        model=model_to_list_out(shoot.model) if shoot.model else None,
    )


def press_post_to_out(post: PressPost) -> PressPostOut:
    return PressPostOut(
        id=post.id,
        slug=post.slug,
        title=post.title,
        excerpt=post.excerpt,
        body=post.body,
        cover_url=storage.get_url(post.cover_key) if post.cover_key else None,
        external_link=post.external_link,
        model_id=post.model_id,
        is_published=post.is_published,
        published_at=post.published_at,
        created_at=post.created_at,
    )


def settings_to_out(settings_row: SiteSettings) -> SiteSettingsOut:
    return SiteSettingsOut(
        hero_video_url=storage.get_url(settings_row.hero_video_key) if settings_row.hero_video_key else None,
        hero_poster_url=storage.get_url(settings_row.hero_poster_key) if settings_row.hero_poster_key else None,
        academy_hero_video_url=storage.get_url(settings_row.academy_hero_video_key) if settings_row.academy_hero_video_key else None,
        academy_hero_poster_url=storage.get_url(settings_row.academy_hero_poster_key) if settings_row.academy_hero_poster_key else None,
        academy_about_image_url=storage.get_url(settings_row.academy_about_image_key) if settings_row.academy_about_image_key else None,
        cta_image_url=storage.get_url(settings_row.cta_image_key) if settings_row.cta_image_key else None,
        brand_name=settings_row.brand_name,
        brand_city=settings_row.brand_city,
        about_heading=settings_row.about_heading,
        about_body1=settings_row.about_body1,
        about_body2=settings_row.about_body2,
        about_heading_ru=settings_row.about_heading_ru,
        about_body1_ru=settings_row.about_body1_ru,
        about_body2_ru=settings_row.about_body2_ru,
        academy_about_title=settings_row.academy_about_title,
        academy_about_body1=settings_row.academy_about_body1,
        academy_about_body2=settings_row.academy_about_body2,
        academy_weeks=settings_row.academy_weeks,
        academy_sessions=settings_row.academy_sessions,
        academy_cohort=settings_row.academy_cohort,
        academy_about_title_ru=settings_row.academy_about_title_ru,
        academy_about_body1_ru=settings_row.academy_about_body1_ru,
        academy_about_body2_ru=settings_row.academy_about_body2_ru,
        legal_details=settings_row.legal_details,
        legal_details_ru=settings_row.legal_details_ru,
    )


def academy_lesson_to_out(lesson: AcademyLesson) -> AcademyLessonOut:
    return AcademyLessonOut(
        id=lesson.id,
        title=lesson.title,
        note=lesson.note,
        title_ru=lesson.title_ru,
        note_ru=lesson.note_ru,
        image_url=storage.get_url(lesson.image_key) if lesson.image_key else None,
        sort_order=lesson.sort_order,
    )


def academy_brand_to_out(brand: AcademyBrand) -> AcademyBrandOut:
    return AcademyBrandOut(
        id=brand.id,
        name=brand.name,
        image_url=storage.get_url(brand.image_key),
        width=brand.width,
        height=brand.height,
        sort_order=brand.sort_order,
    )


def scouting_to_out(submission: ScoutingSubmission) -> ScoutingSubmissionOut:
    return ScoutingSubmissionOut(
        id=submission.id,
        name=submission.name,
        email=submission.email,
        phone=submission.phone,
        city=submission.city,
        birthdate=submission.birthdate,
        height=submission.height,
        instagram=submission.instagram,
        message=submission.message,
        source=submission.source or "apply",
        status=submission.status,
        photo_urls=[storage.get_url(key) for key in (submission.submitted_photo_keys or [])],
        created_at=submission.created_at,
    )
