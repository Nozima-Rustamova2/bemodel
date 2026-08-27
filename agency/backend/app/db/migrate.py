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
    ("site_settings", "academy_about_title_ru", "VARCHAR"),
    ("site_settings", "academy_about_body1_ru", "TEXT"),
    ("site_settings", "academy_about_body2_ru", "TEXT"),
    ("academy_lessons", "title_ru", "VARCHAR"),
    ("academy_lessons", "note_ru", "TEXT"),
    ("scouting_submissions", "source", "VARCHAR"),
    ("academy_brands", "width", "INTEGER"),
    ("academy_brands", "height", "INTEGER"),
    ("photos", "width", "INTEGER"),
    ("photos", "height", "INTEGER"),
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

    _backfill_photo_dimensions()


def _backfill_photo_dimensions():
    """Fill in width/height for photos uploaded before those columns existed.

    The portfolio strip lays each photo out at a shared height and its own
    natural width; without dimensions it has to guess a ratio. Runs once —
    after the first pass there are no rows left to select. Reads each file back
    out of storage, so a photo whose file has gone missing is simply skipped.
    """
    from PIL import Image
    import io

    from app.db.database import SessionLocal
    from app.models.model import Photo
    from app.services.storage import storage

    db = SessionLocal()
    try:
        pending = db.query(Photo).filter(Photo.width.is_(None)).all()
        if not pending:
            return
        filled = 0
        for photo in pending:
            contents = storage.read(photo.filename)
            if not contents:
                continue
            try:
                photo.width, photo.height = Image.open(io.BytesIO(contents)).size
                filled += 1
            except Exception:
                continue
        db.commit()
        print(f"Migrated: backfilled dimensions for {filled}/{len(pending)} photos")
    except Exception as exc:  # never let a backfill stop the app from booting
        db.rollback()
        print(f"Photo dimension backfill skipped: {exc}")
    finally:
        db.close()
