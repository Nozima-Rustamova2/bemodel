from sqlalchemy import inspect, text
from sqlalchemy.exc import OperationalError

from app.db.database import engine

# Additive, hand-rolled migrations. This project has no Alembic — Base.metadata.create_all()
# only creates missing tables, it never alters an existing one. Any new column on a table that
# already shipped needs an entry here, or existing databases will crash on the missing column.
COLUMNS_TO_ADD = [
    ("models", "city", "VARCHAR"),
    ("site_settings", "brand_name", "VARCHAR"),
    ("site_settings", "brand_city", "VARCHAR"),
    ("site_settings", "about_heading", "VARCHAR"),
    ("site_settings", "about_body1", "TEXT"),
    ("site_settings", "about_body2", "TEXT"),
    ("site_settings", "about_step1_title", "VARCHAR"),
    ("site_settings", "about_step1_body", "TEXT"),
    ("site_settings", "about_step2_title", "VARCHAR"),
    ("site_settings", "about_step2_body", "TEXT"),
    ("site_settings", "about_step3_title", "VARCHAR"),
    ("site_settings", "about_step3_body", "TEXT"),
    ("site_settings", "academy_about_title", "VARCHAR"),
    ("site_settings", "academy_about_body1", "TEXT"),
    ("site_settings", "academy_about_body2", "TEXT"),
    ("site_settings", "academy_weeks", "VARCHAR"),
    ("site_settings", "academy_sessions", "VARCHAR"),
    ("site_settings", "academy_cohort", "VARCHAR"),
    ("featured_shoots", "image_key", "VARCHAR"),
    ("site_settings", "academy_about_image_key", "VARCHAR"),
    ("site_settings", "academy_hero_video_key", "VARCHAR"),
    ("site_settings", "academy_hero_poster_key", "VARCHAR"),
    ("site_settings", "about_heading_ru", "VARCHAR"),
    ("site_settings", "about_body1_ru", "TEXT"),
    ("site_settings", "about_body2_ru", "TEXT"),
    ("site_settings", "about_step1_title_ru", "VARCHAR"),
    ("site_settings", "about_step1_body_ru", "TEXT"),
    ("site_settings", "about_step2_title_ru", "VARCHAR"),
    ("site_settings", "about_step2_body_ru", "TEXT"),
    ("site_settings", "about_step3_title_ru", "VARCHAR"),
    ("site_settings", "about_step3_body_ru", "TEXT"),
    ("site_settings", "academy_about_title_ru", "VARCHAR"),
    ("site_settings", "academy_about_body1_ru", "TEXT"),
    ("site_settings", "academy_about_body2_ru", "TEXT"),
    ("academy_lessons", "title_ru", "VARCHAR"),
    ("academy_lessons", "note_ru", "TEXT"),
    ("scouting_submissions", "source", "VARCHAR"),
    ("academy_brands", "width", "INTEGER"),
    ("academy_brands", "height", "INTEGER"),
]


def run_additive_migrations():
    existing_tables = set(inspect(engine).get_table_names())

    for table, column, col_type in COLUMNS_TO_ADD:
        if table not in existing_tables:
            continue  # table doesn't exist yet — create_all() will make it with the column already
        try:
            with engine.begin() as conn:
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}"))
            print(f"Migrated: added {table}.{column}")
        except OperationalError:
            pass  # column already exists
