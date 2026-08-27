from datetime import datetime
from pydantic import BaseModel, ConfigDict


class PhotoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    filename: str
    url: str
    is_cover: bool
    sort_order: int
    width: int | None = None
    height: int | None = None


class ModelBase(BaseModel):
    name: str
    category: str
    bio: str | None = None
    height: str | None = None
    bust: str | None = None
    waist: str | None = None
    hips: str | None = None
    shoes: str | None = None
    eyes: str | None = None
    hair: str | None = None
    is_published: bool = False


class ModelCreate(ModelBase):
    pass


class ModelUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    bio: str | None = None
    height: str | None = None
    bust: str | None = None
    waist: str | None = None
    hips: str | None = None
    shoes: str | None = None
    eyes: str | None = None
    hair: str | None = None
    is_published: bool | None = None


class ModelOut(ModelBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    sort_order: int
    created_at: datetime
    photos: list[PhotoOut] = []


class ModelListOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    name: str
    category: str
    height: str | None = None
    bust: str | None = None
    waist: str | None = None
    hips: str | None = None
    shoes: str | None = None
    hair: str | None = None
    eyes: str | None = None
    is_published: bool
    cover_photo_url: str | None = None
    # First few photos, cover first — the roster card cycles through these on
    # hover, so it needs more than the cover alone.
    preview_photo_urls: list[str] = []


class ReorderPhotos(BaseModel):
    photo_ids_in_order: list[int]
