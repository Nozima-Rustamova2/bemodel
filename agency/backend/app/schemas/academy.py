from pydantic import BaseModel, ConfigDict


class AcademyLessonBase(BaseModel):
    title: str
    note: str | None = None
    title_ru: str | None = None
    note_ru: str | None = None


class AcademyLessonCreate(AcademyLessonBase):
    pass


class AcademyLessonUpdate(BaseModel):
    title: str | None = None
    note: str | None = None
    title_ru: str | None = None
    note_ru: str | None = None


class AcademyLessonOut(AcademyLessonBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    image_url: str | None = None
    sort_order: int


class AcademyBrandUpdate(BaseModel):
    name: str | None = None


class AcademyBrandOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str | None = None
    image_url: str
    width: int | None = None
    height: int | None = None
    sort_order: int


class ReorderItems(BaseModel):
    ids_in_order: list[int]
