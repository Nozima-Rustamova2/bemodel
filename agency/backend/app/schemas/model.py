from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.schemas.video import VideoOut


class PhotoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    filename: str
    url: str
    is_cover: bool
    sort_order: int


class ModelBase(BaseModel):
    name: str
    category: str
    city: str | None = None
    bio: str | None = None
    height: str | None = None
    bust: str | None = None
    waist: str | None = None
    hips: str | None = None
    shoes: str | None = None
    eyes: str | None = None
    hair: str | None = None
    is_published: bool = False
    is_featured: bool = False


class ModelCreate(ModelBase):
    pass


class ModelUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    city: str | None = None
    bio: str | None = None
    height: str | None = None
    bust: str | None = None
    waist: str | None = None
    hips: str | None = None
    shoes: str | None = None
    eyes: str | None = None
    hair: str | None = None
    is_published: bool | None = None
    is_featured: bool | None = None


class ModelOut(ModelBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    sort_order: int
    created_at: datetime
    photos: list[PhotoOut] = []
    videos: list[VideoOut] = []


class ModelListOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    name: str
    category: str
    city: str | None = None
    height: str | None = None
    bust: str | None = None
    waist: str | None = None
    hips: str | None = None
    shoes: str | None = None
    hair: str | None = None
    eyes: str | None = None
    is_published: bool
    is_featured: bool
    cover_photo_url: str | None = None


class ReorderPhotos(BaseModel):
    photo_ids_in_order: list[int]
