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


class AcademyFaqBase(BaseModel):
    question: str
    answer: str | None = None
    question_ru: str | None = None
    answer_ru: str | None = None


class AcademyFaqCreate(AcademyFaqBase):
    pass


class AcademyFaqUpdate(BaseModel):
    question: str | None = None
    answer: str | None = None
    question_ru: str | None = None
    answer_ru: str | None = None


class AcademyFaqOut(AcademyFaqBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sort_order: int


class ReorderItems(BaseModel):
    ids_in_order: list[int]
