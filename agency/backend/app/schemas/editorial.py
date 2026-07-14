from pydantic import BaseModel


class EditorialPhotoOut(BaseModel):
    id: int
    url: str
    sort_order: int


class EditorialAlbumUpdate(BaseModel):
    title: str | None = None


class EditorialAlbumOut(BaseModel):
    id: int
    sort_order: int
    title: str | None = None
    photos: list[EditorialPhotoOut] = []
