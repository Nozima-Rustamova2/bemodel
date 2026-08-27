from pydantic import BaseModel, ConfigDict


class SiteSettingsUpdate(BaseModel):

    brand_name: str | None = None
    brand_city: str | None = None


    about_heading: str | None = None
    about_body1: str | None = None
    about_body2: str | None = None
    about_heading_ru: str | None = None
    about_body1_ru: str | None = None
    about_body2_ru: str | None = None

    academy_about_title: str | None = None
    academy_about_body1: str | None = None
    academy_about_body2: str | None = None
    academy_weeks: str | None = None
    academy_sessions: str | None = None
    academy_cohort: str | None = None
    academy_about_title_ru: str | None = None
    academy_about_body1_ru: str | None = None
    academy_about_body2_ru: str | None = None
    legal_details: str | None = None
    legal_details_ru: str | None = None


class SiteSettingsOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    hero_video_url: str | None = None
    hero_poster_url: str | None = None
    academy_hero_video_url: str | None = None
    academy_hero_poster_url: str | None = None
    academy_about_image_url: str | None = None
    cta_image_url: str | None = None

    brand_name: str | None = None
    brand_city: str | None = None


    about_heading: str | None = None
    about_body1: str | None = None
    about_body2: str | None = None
    about_heading_ru: str | None = None
    about_body1_ru: str | None = None
    about_body2_ru: str | None = None

    academy_about_title: str | None = None
    academy_about_body1: str | None = None
    academy_about_body2: str | None = None
    academy_weeks: str | None = None
    academy_sessions: str | None = None
    academy_cohort: str | None = None
    academy_about_title_ru: str | None = None
    academy_about_body1_ru: str | None = None
    academy_about_body2_ru: str | None = None
    legal_details: str | None = None
    legal_details_ru: str | None = None
