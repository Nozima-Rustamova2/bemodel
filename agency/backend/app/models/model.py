from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship

from app.db.database import Base


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Model(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)  # e.g. Women, New Faces
    city = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    height = Column(String, nullable=True)
    bust = Column(String, nullable=True)
    waist = Column(String, nullable=True)
    hips = Column(String, nullable=True)
    shoes = Column(String, nullable=True)
    eyes = Column(String, nullable=True)
    hair = Column(String, nullable=True)
    is_published = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    photos = relationship(
        "Photo", back_populates="model", cascade="all, delete-orphan", order_by="Photo.sort_order"
    )


class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(Integer, ForeignKey("models.id"), nullable=False)
    filename = Column(String, nullable=False)
    is_cover = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    model = relationship("Model", back_populates="photos")


class PressPost(Base):
    __tablename__ = "press_posts"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    excerpt = Column(Text, nullable=True)
    body = Column(Text, nullable=True)
    cover_key = Column(String, nullable=True)
    external_link = Column(String, nullable=True)
    model_id = Column(Integer, ForeignKey("models.id"), nullable=True)
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    model = relationship("Model")


class SiteSettings(Base):
    """Singleton row (always id=1) holding homepage hero content the director
    can edit without a redeploy."""

    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    hero_video_key = Column(String, nullable=True)
    hero_poster_key = Column(String, nullable=True)
    hero_headline = Column(String, nullable=True)
    hero_subheadline = Column(String, nullable=True)
    academy_headline = Column(String, nullable=True)
    academy_subheadline = Column(String, nullable=True)
    academy_hero_video_key = Column(String, nullable=True)
    academy_hero_poster_key = Column(String, nullable=True)

    brand_name = Column(String, nullable=True)
    brand_city = Column(String, nullable=True)

    hero_pre = Column(String, nullable=True)
    hero_em = Column(String, nullable=True)
    hero_post = Column(String, nullable=True)
    hero_body = Column(Text, nullable=True)
    hero_subheadline_ru = Column(String, nullable=True)
    hero_pre_ru = Column(String, nullable=True)
    hero_em_ru = Column(String, nullable=True)
    hero_post_ru = Column(String, nullable=True)
    hero_body_ru = Column(Text, nullable=True)

    manifesto_title = Column(String, nullable=True)
    manifesto_body1 = Column(Text, nullable=True)
    manifesto_body2 = Column(Text, nullable=True)
    manifesto_image_key = Column(String, nullable=True)
    manifesto_title_ru = Column(String, nullable=True)
    manifesto_body1_ru = Column(Text, nullable=True)
    manifesto_body2_ru = Column(Text, nullable=True)

    about_heading = Column(String, nullable=True)
    about_body1 = Column(Text, nullable=True)
    about_body2 = Column(Text, nullable=True)
    about_step1_title = Column(String, nullable=True)
    about_step1_body = Column(Text, nullable=True)
    about_step2_title = Column(String, nullable=True)
    about_step2_body = Column(Text, nullable=True)
    about_step3_title = Column(String, nullable=True)
    about_step3_body = Column(Text, nullable=True)
    about_heading_ru = Column(String, nullable=True)
    about_body1_ru = Column(Text, nullable=True)
    about_body2_ru = Column(Text, nullable=True)
    about_step1_title_ru = Column(String, nullable=True)
    about_step1_body_ru = Column(Text, nullable=True)
    about_step2_title_ru = Column(String, nullable=True)
    about_step2_body_ru = Column(Text, nullable=True)
    about_step3_title_ru = Column(String, nullable=True)
    about_step3_body_ru = Column(Text, nullable=True)

    academy_about_title = Column(String, nullable=True)
    academy_about_body1 = Column(Text, nullable=True)
    academy_about_body2 = Column(Text, nullable=True)
    academy_weeks = Column(String, nullable=True)
    academy_sessions = Column(String, nullable=True)
    academy_cohort = Column(String, nullable=True)
    academy_about_image_key = Column(String, nullable=True)
    academy_headline_ru = Column(String, nullable=True)
    academy_subheadline_ru = Column(String, nullable=True)
    academy_about_title_ru = Column(String, nullable=True)
    academy_about_body1_ru = Column(Text, nullable=True)
    academy_about_body2_ru = Column(Text, nullable=True)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FeaturedShoot(Base):
    """Fixed 4-slot 'Latest shoots' grid on the homepage: each slot optionally
    links a model and carries a free-text credit line."""

    __tablename__ = "featured_shoots"

    id = Column(Integer, primary_key=True, index=True)
    sort_order = Column(Integer, default=0)
    model_id = Column(Integer, ForeignKey("models.id"), nullable=True)
    credit = Column(String, nullable=True)
    image_key = Column(String, nullable=True)

    model = relationship("Model")


class EditorialAlbum(Base):
    """Fixed 5-slot 'Editorial Stories' grid on the homepage. Each album holds
    up to 10 admin-uploaded photos; the public site opens them in a lightbox."""

    __tablename__ = "editorial_albums"

    id = Column(Integer, primary_key=True, index=True)
    sort_order = Column(Integer, default=0)
    title = Column(String, nullable=True)

    photos = relationship(
        "EditorialPhoto",
        back_populates="album",
        cascade="all, delete-orphan",
        order_by="EditorialPhoto.sort_order",
    )


class EditorialPhoto(Base):
    __tablename__ = "editorial_photos"

    id = Column(Integer, primary_key=True, index=True)
    album_id = Column(Integer, ForeignKey("editorial_albums.id"), nullable=False)
    image_key = Column(String, nullable=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    album = relationship("EditorialAlbum", back_populates="photos")


class AcademyLesson(Base):
    __tablename__ = "academy_lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    note = Column(Text, nullable=True)
    title_ru = Column(String, nullable=True)
    note_ru = Column(Text, nullable=True)
    image_key = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class AcademyFaq(Base):
    __tablename__ = "academy_faqs"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(Text, nullable=True)
    question_ru = Column(String, nullable=True)
    answer_ru = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class ScoutingSubmission(Base):
    __tablename__ = "scouting_submissions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    city = Column(String, nullable=True)
    birthdate = Column(String, nullable=True)
    height = Column(String, nullable=True)
    instagram = Column(String, nullable=True)
    message = Column(Text, nullable=True)
    submitted_photo_keys = Column(JSON, default=list)
    status = Column(String, default="new")  # new | reviewed | archived
    created_at = Column(DateTime, default=datetime.utcnow)
