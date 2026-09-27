from datetime import datetime
from typing import Optional
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


# ---------------------------------------------------------
# M5 - Santali Language Safety schemas
# ---------------------------------------------------------

class GlossaryEntry(BaseModel):
    id: str
    hindi: Optional[str] = None
    santali: Optional[str] = None
    ol_chiki: Optional[str] = None
    transliteration: Optional[str] = None
    category: Optional[str] = None
    context: Optional[str] = None
    status: str
    confidence: float = 0.0
    source: Optional[str] = None
    reviewer: Optional[str] = None
    notes: Optional[str] = None


class LanguagePackResponse(BaseModel):
    entries: list[GlossaryEntry]
    categories: list[str]
    total_entries: int


class TranslationVerifyRequest(BaseModel):
    source_lang: str
    target_lang: str
    source_text: str
    translated_text: Optional[str] = None
    category: Optional[str] = None
    context: Optional[str] = None


class TranslationVerifyResponse(BaseModel):
    allowed: bool
    status: str
    confidence: float
    reason: str
    translation: Optional[str] = None
    matched_entry_id: Optional[str] = None


class TeacherCorrectionCreate(BaseModel):
    hindi: str
    ai_santali: Optional[str] = None
    corrected_santali: str
    ol_chiki: Optional[str] = None
    category: Optional[str] = None
    context: Optional[str] = None
    notes: Optional[str] = None
    teacher_id: Optional[str] = None


class TeacherCorrectionResponse(BaseModel):
    id: int
    hindi: str
    ai_santali: Optional[str] = None
    corrected_santali: str
    ol_chiki: Optional[str] = None
    category: Optional[str] = None
    context: Optional[str] = None
    notes: Optional[str] = None
    teacher_id: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LanguageStatusResponse(BaseModel):
    total_entries: int
    status_counts: dict
    category_counts: dict
    categories: list[str]