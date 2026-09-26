"""
analytics/service.py

M6 -- Analytics + Offline
Backend Analytics Foundation (Phase 2)

WHAT THIS FILE DOES:
Pure analytics computation logic. No FastAPI code, no routes.
Every function takes a SQLAlchemy Session and returns a plain dict.

WHAT DATA THIS FILE USES:
Only the confirmed Lesson model fields:
    id, grade, subject, topic, outcome,
    teaching_language, classroom_language,
    status, duration, language_status

There is currently no Student, Assessment, MasteryRecord, LearningGap,
TeacherActivity, or real Translation-verification table. This file does
NOT invent numbers for those. Sections that depend on them are marked
"status": "pending" with a note on which module owns that data.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Lesson


# ---------------------------------------------------------------------------
# Small helpers -- keep the response shape consistent across sections
# ---------------------------------------------------------------------------

def _pending_section(depends_on: str, note: str) -> dict:
    """
    Standard shape for analytics we cannot compute yet because the real
    data source (owned by another module) has not been provided.
    """
    return {
        "status": "pending",
        "depends_on": depends_on,
        "data": None,
        "note": note,
    }


def _available_section(data: dict) -> dict:
    """
    Standard shape for analytics computed from real database data.
    """
    return {
        "status": "available",
        "source": "database",
        "data": data,
    }


def _count_by(db: Session, column) -> dict:
    """
    Groups Lesson rows by the given column and returns {value: count}.
    Empty/None values are grouped under "Unspecified" instead of
    crashing or being silently dropped.
    """
    rows = db.query(column, func.count(Lesson.id)).group_by(column).all()
    return {
        (value if value not in (None, "") else "Unspecified"): count
        for value, count in rows
    }


# ---------------------------------------------------------------------------
# REAL DATA -- computed directly from the Lesson table
# ---------------------------------------------------------------------------

def get_lesson_summary(db: Session) -> dict:
    """
    Real analytics from Lesson:
    total lessons, and breakdowns by status / grade / subject / topic.
    """
    total_lessons = db.query(func.count(Lesson.id)).scalar() or 0

    return {
        "total_lessons": total_lessons,
        "by_status": _count_by(db, Lesson.status),
        "by_grade": _count_by(db, Lesson.grade),
        "by_subject": _count_by(db, Lesson.subject),
        "by_topic": _count_by(db, Lesson.topic),
    }


def get_language_analytics(db: Session) -> dict:
    """
    Real analytics from Lesson, based ONLY on existing Lesson fields:
    - classroom_language distribution
    - teaching_language distribution
    - lesson-level language_status distribution

    IMPORTANT: Lesson.language_status is a per-lesson field (e.g.
    "Pending verification"). This is LESSON LANGUAGE-STATUS ANALYTICS,
    not real Santali translation-verification data. A real translation
    verification pipeline belongs to M5 and does not exist yet -- see
    the "translation_verification" pending note included in this
    section's data.
    """
    return {
        "classroom_language_distribution": _count_by(db, Lesson.classroom_language),
        "teaching_language_distribution": _count_by(db, Lesson.teaching_language),
        "lesson_language_status_distribution": _count_by(db, Lesson.language_status),
        "translation_verification": _pending_section(
            depends_on="M5",
            note="POST /translation/translate is currently a stub and "
                 "returns no verification data. Real verified/pending/"
                 "rejected translation counts and weekly translation "
                 "stats require an M5 data source that does not exist yet. "
                 "The lesson_language_status_distribution above reflects "
                 "Lesson.language_status only -- it is not translation "
                 "verification data.",
        ),
    }


def get_overview(db: Session) -> dict:
    """
    Top-level overview. Combines real Lesson-based facts with explicit
    pending placeholders for numbers that require Student/Assessment/
    MasteryRecord data M6 does not have.
    """
    total_lessons = db.query(func.count(Lesson.id)).scalar() or 0
    status_counts = _count_by(db, Lesson.status)

    return {
        "lessons": _available_section({
            "total_lessons": total_lessons,
            "lessons_by_status": status_counts,
        }),
        "students": _pending_section(
            depends_on="M1/M4",
            note="No Student model/API provided yet. Total/active "
                 "student counts cannot be computed.",
        ),
        "average_mastery": _pending_section(
            depends_on="M4",
            note="No MasteryRecord model/API provided yet.",
        ),
        "students_needing_support": _pending_section(
            depends_on="M4",
            note="Depends on mastery/assessment data not yet available.",
        ),
        "assessment_performance": _pending_section(
            depends_on="M4",
            note="No Assessment model/API provided yet.",
        ),
        "participation": _pending_section(
            depends_on="M1/M4",
            note="Requires student activity data not yet available.",
        ),
    }


# ---------------------------------------------------------------------------
# PENDING SECTIONS -- explicitly not computed yet, depend on M2-M5
# ---------------------------------------------------------------------------

def get_student_progress_section() -> dict:
    return _pending_section(
        depends_on="M4",
        note="Individual student progress, topic-wise progress and "
             "reinforcement status require Student/MasteryRecord data "
             "not yet provided to M6.",
    )


def get_mastery_section() -> dict:
    return _pending_section(
        depends_on="M4",
        note="Mastery breakdown and topic mastery require MasteryRecord "
             "data not yet provided to M6.",
    )


def get_learning_gaps_section() -> dict:
    return _pending_section(
        depends_on="M4",
        note="Learning gap detection belongs to M4 (Assessment + "
             "Learning Gaps). No LearningGap model/API provided yet.",
    )


def get_class_performance_section() -> dict:
    return _pending_section(
        depends_on="M4",
        note="Class mastery distribution and correct/incorrect response "
             "stats require Assessment/MasteryRecord data not yet "
             "available. (Lesson-level breakdowns are available "
             "separately via /analytics/lessons/summary.)",
    )


def get_teacher_activity_section() -> dict:
    return _pending_section(
        depends_on="M1/M3",
        note="The Lesson model has no teacher/user attribution field, "
             "so lessons cannot be broken down per teacher. "
             "Reinforcement/assessment activity also depends on M3/M4 "
             "data not yet available.",
    )


# ---------------------------------------------------------------------------
# COMBINED DASHBOARD -- stable, extensible response shape
# ---------------------------------------------------------------------------

def get_full_dashboard(db: Session) -> dict:
    """
    Full analytics response shape:
        overview, student_progress, mastery, learning_gaps,
        class_performance, teacher_activity, language_analytics

    Real sections are backed by Lesson data. Every other section is
    explicitly marked pending -- never filled with invented numbers.
    This shape is designed to stay stable: when M4/M5 provide real data
    later, only the corresponding function above needs to change.
    """
    return {
        "overview": get_overview(db),
        "student_progress": get_student_progress_section(),
        "mastery": get_mastery_section(),
        "learning_gaps": get_learning_gaps_section(),
        "class_performance": get_class_performance_section(),
        "teacher_activity": get_teacher_activity_section(),
        "language_analytics": _available_section(get_language_analytics(db)),
    }