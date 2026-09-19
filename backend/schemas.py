from pydantic import BaseModel


class LessonCreate(BaseModel):
    grade: str
    subject: str
    topic: str
    outcome: str
    teaching_language: str
    classroom_language: str
    status: str = "Draft"
    duration: str = "25 min"
    language_status: str = "Pending verification"


class LessonResponse(LessonCreate):
    id: int

    class Config:
        from_attributes = True