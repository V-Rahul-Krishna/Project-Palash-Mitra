"""
routes/analytics.py

M6 -- Analytics + Offline
Backend Analytics Foundation (Phase 2)

This file only defines API endpoints. All computation logic lives in
analytics/service.py -- every endpoint just calls a service function
and returns the result.

DATABASE DEPENDENCY:
database.py does NOT expose a shared get_db() function, and
routes/lessons.py defines its own LOCAL get_db(). To avoid modifying
any existing file, this router defines its own local get_db() the
same way, using SessionLocal (which database.py already exports).
This does not change database.py or lessons.py in any way.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from analytics import service

router = APIRouter(prefix="/analytics", tags=["analytics"])


def get_db():
    """
    Local database session dependency for analytics routes only.
    Mirrors the same pattern already used in routes/lessons.py.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/overview")
def get_overview(db: Session = Depends(get_db)):
    """
    Top-level analytics overview: real Lesson-based numbers plus
    explicitly-marked pending sections for data M6 does not have yet.
    """
    return service.get_overview(db)


@router.get("/lessons/summary")
def get_lessons_summary(db: Session = Depends(get_db)):
    """
    Real analytics from the Lesson table: total lessons, and
    breakdowns by status / grade / subject / topic.
    """
    return service.get_lesson_summary(db)


@router.get("/language")
def get_language_analytics(db: Session = Depends(get_db)):
    """
    Real lesson language-status analytics: classroom language
    distribution, teaching language distribution, and
    Lesson.language_status distribution.

    NOTE: this is lesson-level data, not real translation-verification
    data -- see the "translation_verification" pending note inside the
    response for details.
    """
    return service.get_language_analytics(db)


@router.get("/dashboard")
def get_full_dashboard(db: Session = Depends(get_db)):
    """
    Combined analytics response: overview, student_progress, mastery,
    learning_gaps, class_performance, teacher_activity,
    language_analytics.

    Real sections are backed by the Lesson table. All other sections
    are explicitly marked "pending" with the module they depend on.
    """
    return service.get_full_dashboard(db)