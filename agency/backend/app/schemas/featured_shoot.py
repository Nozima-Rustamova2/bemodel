from pydantic import BaseModel

from app.schemas.model import ModelListOut


class FeaturedShootUpdate(BaseModel):
    model_id: int | None = None
    credit: str | None = None


class FeaturedShootOut(BaseModel):
    id: int
    sort_order: int
    model_id: int | None = None
    credit: str | None = None
    image_url: str | None = None
    model: ModelListOut | None = None
