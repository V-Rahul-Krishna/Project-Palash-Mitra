from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    grade = Column(String)
    subject = Column(String)
    topic = Column(String)
    outcome = Column(Text)
    teaching_language = Column(String)
    classroom_language = Column(String)


class TeacherCorrection(Base):
    """
    M5 - Santali Language Safety

    Stores teacher-submitted corrections to AI-generated Santali
    translations. A row here is ALWAYS created with status
    REVIEW_REQUIRED - it must never be auto-promoted to VERIFIED.
    Promotion to VERIFIED (i.e. writing the term into the verified
    glossary) is a separate native-speaker validation step that is
    out of scope for this hackathon prototype.
    """
    __tablename__ = "teacher_corrections"

    id = Column(Integer, primary_key=True, index=True)
    hindi = Column(Text, nullable=False)
    ai_santali = Column(Text, nullable=True)
    corrected_santali = Column(Text, nullable=False)
    ol_chiki = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    context = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    teacher_id = Column(String, nullable=True)
    status = Column(String, nullable=False, default="REVIEW_REQUIRED")
    created_at = Column(DateTime(timezone=True), server_default=func.now())