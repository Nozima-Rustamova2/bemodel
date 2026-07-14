from pydantic import BaseModel, ConfigDict


class SiteSettingsUpdate(BaseModel):
    hero_headline: str | None = None
    hero_subheadline: str | None = None
    academy_headline: str | None = None
    academy_subheadline: str | None = None

    brand_name: str | None = None
    brand_city: str | None = None

    hero_pre: str | None = None
    hero_em: str | None = None
    hero_post: str | None = None
    hero_body: str | None = None
    hero_subheadline_ru: str | None = None
    hero_pre_ru: str | None = None
    hero_em_ru: str | None = None
    hero_post_ru: str | None = None
    hero_body_ru: str | None = None

    manifesto_title: str | None = None
    manifesto_body1: str | None = None
    manifesto_body2: str | None = None
    manifesto_title_ru: str | None = None
    manifesto_body1_ru: str | None = None
    manifesto_body2_ru: str | None = None

    about_heading: str | None = None
    about_body1: str | None = None
    about_body2: str | None = None
    about_step1_title: str | None = None
    about_step1_body: str | None = None
    about_step2_title: str | None = None
    about_step2_body: str | None = None
    about_step3_title: str | None = None
    about_step3_body: str | None = None
    about_heading_ru: str | None = None
    about_body1_ru: str | None = None
    about_body2_ru: str | None = None
    about_step1_title_ru: str | None = None
    about_step1_body_ru: str | None = None
    about_step2_title_ru: str | None = None
    about_step2_body_ru: str | None = None
    about_step3_title_ru: str | None = None
    about_step3_body_ru: str | None = None

    academy_about_title: str | None = None
    academy_about_body1: str | None = None
    academy_about_body2: str | None = None
    academy_weeks: str | None = None
    academy_sessions: str | None = None
    academy_cohort: str | None = None
    academy_headline_ru: str | None = None
    academy_subheadline_ru: str | None = None
    academy_about_title_ru: str | None = None
    academy_about_body1_ru: str | None = None
    academy_about_body2_ru: str | None = None


class SiteSettingsOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    hero_video_url: str | None = None
    hero_poster_url: str | None = None
    hero_headline: str | None = None
    hero_subheadline: str | None = None
    academy_headline: str | None = None
    academy_subheadline: str | None = None
    academy_hero_video_url: str | None = None
    academy_hero_poster_url: str | None = None
    manifesto_image_url: str | None = None
    academy_about_image_url: str | None = None

    brand_name: str | None = None
    brand_city: str | None = None

    hero_pre: str | None = None
    hero_em: str | None = None
    hero_post: str | None = None
    hero_body: str | None = None
    hero_subheadline_ru: str | None = None
    hero_pre_ru: str | None = None
    hero_em_ru: str | None = None
    hero_post_ru: str | None = None
    hero_body_ru: str | None = None

    manifesto_title: str | None = None
    manifesto_body1: str | None = None
    manifesto_body2: str | None = None
    manifesto_title_ru: str | None = None
    manifesto_body1_ru: str | None = None
    manifesto_body2_ru: str | None = None

    about_heading: str | None = None
    about_body1: str | None = None
    about_body2: str | None = None
    about_step1_title: str | None = None
    about_step1_body: str | None = None
    about_step2_title: str | None = None
    about_step2_body: str | None = None
    about_step3_title: str | None = None
    about_step3_body: str | None = None
    about_heading_ru: str | None = None
    about_body1_ru: str | None = None
    about_body2_ru: str | None = None
    about_step1_title_ru: str | None = None
    about_step1_body_ru: str | None = None
    about_step2_title_ru: str | None = None
    about_step2_body_ru: str | None = None
    about_step3_title_ru: str | None = None
    about_step3_body_ru: str | None = None

    academy_about_title: str | None = None
    academy_about_body1: str | None = None
    academy_about_body2: str | None = None
    academy_weeks: str | None = None
    academy_sessions: str | None = None
    academy_cohort: str | None = None
    academy_headline_ru: str | None = None
    academy_subheadline_ru: str | None = None
    academy_about_title_ru: str | None = None
    academy_about_body1_ru: str | None = None
    academy_about_body2_ru: str | None = None
