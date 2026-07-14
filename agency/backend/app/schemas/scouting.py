from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ScoutingSubmissionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    phone: str | None = None
    city: str | None = None
    birthdate: str | None = None
    height: str | None = None
    instagram: str | None = None
    message: str | None = None
    status: str
    photo_urls: list[str] = []
    created_at: datetime


class ScoutingStatusUpdate(BaseModel):
    status: str  # "new" | "reviewed" | "archived"
