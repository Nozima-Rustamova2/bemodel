from pydantic import BaseModel, ConfigDict


class VideoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    caption: str | None = None
    url: str
    poster_url: str | None = None
    is_published: bool
    sort_order: int


class ReorderVideos(BaseModel):
    video_ids_in_order: list[int]
