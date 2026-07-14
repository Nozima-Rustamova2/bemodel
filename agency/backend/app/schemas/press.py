from datetime import datetime
from pydantic import BaseModel, ConfigDict


class PressPostBase(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    title: str
    excerpt: str | None = None
    body: str | None = None
    external_link: str | None = None
    model_id: int | None = None
    is_published: bool = False


class PressPostCreate(PressPostBase):
    pass


class PressPostUpdate(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    title: str | None = None
    excerpt: str | None = None
    body: str | None = None
    external_link: str | None = None
    model_id: int | None = None
    is_published: bool | None = None


class PressPostOut(PressPostBase):
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())

    id: int
    slug: str
    cover_url: str | None = None
    published_at: datetime | None = None
    created_at: datetime
