from app.models.model import (
    Model,
    PressPost,
    ScoutingSubmission,
    SiteSettings,
    AcademyLesson,
    AcademyFaq,
    FeaturedShoot,
    EditorialAlbum,
)
from app.schemas.model import ModelOut, ModelListOut, PhotoOut
from app.schemas.press import PressPostOut
from app.schemas.scouting import ScoutingSubmissionOut
from app.schemas.settings import SiteSettingsOut
from app.schemas.academy import AcademyLessonOut, AcademyFaqOut
from app.schemas.featured_shoot import FeaturedShootOut
from app.schemas.editorial import EditorialAlbumOut, EditorialPhotoOut
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
        )
        for p in sorted(model.photos, key=lambda p: p.sort_order)
    ]

    return ModelOut(
        id=model.id,
        slug=model.slug,
        name=model.name,
        category=model.category,
        city=model.city,
        bio=model.bio,
        height=model.height,
        bust=model.bust,
        waist=model.waist,
        hips=model.hips,
        shoes=model.shoes,
        eyes=model.eyes,
        hair=model.hair,
        is_published=model.is_published,
        is_featured=model.is_featured,
        sort_order=model.sort_order,
        created_at=model.created_at,
        photos=photos,
    )


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
        city=model.city,
        height=model.height,
        bust=model.bust,
        waist=model.waist,
        hips=model.hips,
        shoes=model.shoes,
        hair=model.hair,
        eyes=model.eyes,
        is_published=model.is_published,
        is_featured=model.is_featured,
        cover_photo_url=model_cover_url(model),
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


def editorial_album_to_out(album: EditorialAlbum) -> EditorialAlbumOut:
    return EditorialAlbumOut(
        id=album.id,
        sort_order=album.sort_order,
        title=album.title,
        photos=[
            EditorialPhotoOut(id=p.id, url=storage.get_url(p.image_key), sort_order=p.sort_order)
            for p in sorted(album.photos, key=lambda p: p.sort_order)
        ],
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
        hero_headline=settings_row.hero_headline,
        hero_subheadline=settings_row.hero_subheadline,
        academy_headline=settings_row.academy_headline,
        academy_subheadline=settings_row.academy_subheadline,
        academy_hero_video_url=storage.get_url(settings_row.academy_hero_video_key) if settings_row.academy_hero_video_key else None,
        academy_hero_poster_url=storage.get_url(settings_row.academy_hero_poster_key) if settings_row.academy_hero_poster_key else None,
        manifesto_image_url=storage.get_url(settings_row.manifesto_image_key) if settings_row.manifesto_image_key else None,
        academy_about_image_url=storage.get_url(settings_row.academy_about_image_key) if settings_row.academy_about_image_key else None,
        brand_name=settings_row.brand_name,
        brand_city=settings_row.brand_city,
        hero_pre=settings_row.hero_pre,
        hero_em=settings_row.hero_em,
        hero_post=settings_row.hero_post,
        hero_body=settings_row.hero_body,
        hero_subheadline_ru=settings_row.hero_subheadline_ru,
        hero_pre_ru=settings_row.hero_pre_ru,
        hero_em_ru=settings_row.hero_em_ru,
        hero_post_ru=settings_row.hero_post_ru,
        hero_body_ru=settings_row.hero_body_ru,
        manifesto_title=settings_row.manifesto_title,
        manifesto_body1=settings_row.manifesto_body1,
        manifesto_body2=settings_row.manifesto_body2,
        manifesto_title_ru=settings_row.manifesto_title_ru,
        manifesto_body1_ru=settings_row.manifesto_body1_ru,
        manifesto_body2_ru=settings_row.manifesto_body2_ru,
        about_heading=settings_row.about_heading,
        about_body1=settings_row.about_body1,
        about_body2=settings_row.about_body2,
        about_step1_title=settings_row.about_step1_title,
        about_step1_body=settings_row.about_step1_body,
        about_step2_title=settings_row.about_step2_title,
        about_step2_body=settings_row.about_step2_body,
        about_step3_title=settings_row.about_step3_title,
        about_step3_body=settings_row.about_step3_body,
        about_heading_ru=settings_row.about_heading_ru,
        about_body1_ru=settings_row.about_body1_ru,
        about_body2_ru=settings_row.about_body2_ru,
        about_step1_title_ru=settings_row.about_step1_title_ru,
        about_step1_body_ru=settings_row.about_step1_body_ru,
        about_step2_title_ru=settings_row.about_step2_title_ru,
        about_step2_body_ru=settings_row.about_step2_body_ru,
        about_step3_title_ru=settings_row.about_step3_title_ru,
        about_step3_body_ru=settings_row.about_step3_body_ru,
        academy_about_title=settings_row.academy_about_title,
        academy_about_body1=settings_row.academy_about_body1,
        academy_about_body2=settings_row.academy_about_body2,
        academy_weeks=settings_row.academy_weeks,
        academy_sessions=settings_row.academy_sessions,
        academy_cohort=settings_row.academy_cohort,
        academy_headline_ru=settings_row.academy_headline_ru,
        academy_subheadline_ru=settings_row.academy_subheadline_ru,
        academy_about_title_ru=settings_row.academy_about_title_ru,
        academy_about_body1_ru=settings_row.academy_about_body1_ru,
        academy_about_body2_ru=settings_row.academy_about_body2_ru,
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


def academy_faq_to_out(faq: AcademyFaq) -> AcademyFaqOut:
    return AcademyFaqOut(
        id=faq.id,
        question=faq.question,
        answer=faq.answer,
        question_ru=faq.question_ru,
        answer_ru=faq.answer_ru,
        sort_order=faq.sort_order,
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
