from pydantic import BaseModel


class LessonCreate(BaseModel):
    grade: str
    subject: str
    topic: str
    outcome: str
    teaching_language: str
    classroom_language: str


class LessonResponse(LessonCreate):
    id: int

    class Config:
        from_attributes = True