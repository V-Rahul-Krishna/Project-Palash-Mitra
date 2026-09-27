"""
PALASH MITRA - Santali Language Safety

M5 Module - API routes

Exposes the language pack, glossary search, translation verification,
teacher corrections and a status summary. See services/language_safety.py
for the actual safety logic - these routes are thin wrappers around it.
"""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import TeacherCorrection
from schemas import (
    GlossaryEntry,
    LanguagePackResponse,
    LanguageStatusResponse,
    TeacherCorrectionCreate,
    TeacherCorrectionResponse,
    TranslationVerifyRequest,
    TranslationVerifyResponse,
)
from services import language_safety

router = APIRouter(prefix="/language", tags=["Language Safety (M5)"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/pack", response_model=LanguagePackResponse)
def get_language_pack():
    """Return the full merged language pack (glossary + classroom phrases)."""
    return language_safety.load_language_pack()


@router.get("/glossary", response_model=list[GlossaryEntry])
def search_glossary(
    query: Optional[str] = None,
    category: Optional[str] = None,
    context: Optional[str] = None,
    status: Optional[str] = None,
):
    """Search the glossary by free-text query, category, context and/or status."""
    return language_safety.search_glossary(
        query=query, category=category, context=context, status=status
    )


@router.get("/glossary/{term}", response_model=GlossaryEntry)
def get_glossary_term(term: str):
    """Look up a single Hindi term/phrase by exact (case-insensitive) match."""
    entry = language_safety.lookup_phrase(term)
    if entry is None:
        raise HTTPException(status_code=404, detail="No glossary entry for this term")
    return entry


@router.post("/verify", response_model=TranslationVerifyResponse)
def verify_translation(payload: TranslationVerifyRequest):
    """
    Verify an AI-produced translation against the verified glossary.
    Never treats AI confidence as linguistic truth - see
    services/language_safety.verify_translation for the rules.
    """
    return language_safety.verify_translation(
        source_lang=payload.source_lang,
        target_lang=payload.target_lang,
        source_text=payload.source_text,
        translated_text=payload.translated_text,
        category=payload.category,
        context=payload.context,
    )


@router.post("/correction", response_model=TeacherCorrectionResponse)
def submit_teacher_correction(
    payload: TeacherCorrectionCreate, db: Session = Depends(get_db)
):
    """
    Submit a teacher correction for an AI-generated translation.

    IMPORTANT: this always creates a REVIEW_REQUIRED record. Promotion
    to VERIFIED is a separate native-speaker validation step and is not
    performed by this endpoint.
    """
    try:
        record = language_safety.build_teacher_correction_record(
            hindi=payload.hindi,
            ai_santali=payload.ai_santali,
            corrected_santali=payload.corrected_santali,
            ol_chiki=payload.ol_chiki,
            category=payload.category,
            context=payload.context,
            notes=payload.notes,
            teacher_id=payload.teacher_id,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    correction = TeacherCorrection(
        hindi=record["hindi"],
        ai_santali=record["ai_santali"],
        corrected_santali=record["corrected_santali"],
        ol_chiki=record["ol_chiki"],
        category=record["category"],
        context=record["context"],
        notes=record["notes"],
        teacher_id=record["teacher_id"],
        status=record["status"],
    )
    db.add(correction)
    db.commit()
    db.refresh(correction)

    return correction


@router.get("/corrections", response_model=list[TeacherCorrectionResponse])
def list_teacher_corrections(
    status: Optional[str] = None, db: Session = Depends(get_db)
):
    """List submitted teacher corrections, optionally filtered by status."""
    q = db.query(TeacherCorrection)
    if status:
        q = q.filter(TeacherCorrection.status == status)
    return q.order_by(TeacherCorrection.id.desc()).all()


@router.get("/status", response_model=LanguageStatusResponse)
def get_language_status():
    """Summary of glossary readiness: counts by status and category."""
    return language_safety.get_language_status()
