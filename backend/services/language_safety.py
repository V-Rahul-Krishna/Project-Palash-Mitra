"""
PALASH MITRA - Santali Language Safety

M5 Module

This module guards every Hindi <-> Santali translation that reaches a
classroom. It never treats AI-generated text as linguistic truth: a
translation is only VERIFIED when it matches a glossary entry that a
native-speaker/linguist reviewer has already signed off on.

Flow:
    AI Translation (M2 owns this)
        -> M5 language safety (this module)
        -> glossary / verification
        -> confidence + status
        -> classroom delivery (M1 / M3)

Integration point for M2: call verify_translation(...) with whatever
M2's translation engine produces. This module does not perform
translation itself and does not depend on M2's implementation.
"""

import json
import os
from datetime import datetime, timezone

STATUS_VERIFIED = "VERIFIED"
STATUS_REVIEW_REQUIRED = "REVIEW_REQUIRED"
STATUS_UNVERIFIED = "UNVERIFIED"

VALID_STATUSES = {STATUS_VERIFIED, STATUS_REVIEW_REQUIRED, STATUS_UNVERIFIED}

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "santali")
GLOSSARY_FILE = os.path.join(DATA_DIR, "glossary.json")
PHRASES_FILE = os.path.join(DATA_DIR, "classroom_phrases.json")


# ---------------------------------------------------------
# 1. LANGUAGE PACK LOADING
# ---------------------------------------------------------

def _load_json(path):
    if not os.path.exists(path):
        return {"_meta": {}, "entries": []}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_language_pack():
    """
    Load and merge the glossary + classroom-phrases data files into a
    single language pack. Read-only; does not mutate the source files.
    """
    glossary = _load_json(GLOSSARY_FILE)
    phrases = _load_json(PHRASES_FILE)

    entries = list(glossary.get("entries", [])) + list(phrases.get("entries", []))
    categories = sorted({e.get("category") for e in entries if e.get("category")})

    return {
        "entries": entries,
        "categories": categories,
        "total_entries": len(entries),
    }


# ---------------------------------------------------------
# 2. GLOSSARY SEARCH / LOOKUP
# ---------------------------------------------------------

def search_glossary(query=None, category=None, context=None, status=None):
    """
    Search the merged language pack by free-text query (matched against
    hindi/santali/transliteration), category, context and/or status.
    All filters are optional and combine with AND semantics.
    """
    results = load_language_pack()["entries"]

    if category:
        results = [e for e in results if e.get("category") == category]

    if context:
        results = [e for e in results if e.get("context") == context]

    if status:
        results = [e for e in results if e.get("status") == status]

    if query:
        q = query.strip().lower()

        def _match(e):
            fields = [e.get("hindi"), e.get("santali"), e.get("transliteration")]
            return any(f and q in f.lower() for f in fields)

        results = [e for e in results if _match(e)]

    return results


def lookup_phrase(term):
    """
    Look up a single Hindi term/phrase (exact match, case-insensitive)
    across the merged language pack. Returns the entry dict or None.
    """
    if not term:
        return None
    term_l = term.strip().lower()
    for entry in load_language_pack()["entries"]:
        if entry.get("hindi") and entry["hindi"].strip().lower() == term_l:
            return entry
    return None


# ---------------------------------------------------------
# 3. TRANSLATION VERIFICATION
# ---------------------------------------------------------

def verify_translation(source_lang, target_lang, source_text, translated_text,
                        category=None, context=None):
    """
    Decide whether an AI-produced translation is safe to show to a
    classroom.

    IMPORTANT: AI confidence is never treated as linguistic truth. This
    only returns VERIFIED when `translated_text` matches a glossary
    entry that is itself already VERIFIED.

    Returns:
        {
            "allowed": bool,
            "status": "VERIFIED" | "REVIEW_REQUIRED" | "UNVERIFIED",
            "confidence": float,
            "reason": str,
            "translation": str | None,
            "matched_entry_id": str | None,
        }
    """
    if not source_text or not source_text.strip():
        return {
            "allowed": False,
            "status": STATUS_UNVERIFIED,
            "confidence": 0.0,
            "reason": "Empty source_text - nothing to verify.",
            "translation": None,
            "matched_entry_id": None,
        }

    entry = lookup_phrase(source_text)

    # If the caller supplied category/context and the best match disagrees,
    # treat it as no match rather than silently ignoring the mismatch.
    if entry and category and entry.get("category") != category:
        entry = None
    if entry and context and entry.get("context") != context:
        entry = None

    if entry is None:
        return {
            "allowed": False,
            "status": STATUS_UNVERIFIED,
            "confidence": 0.0,
            "reason": "No glossary entry exists for this source text. "
                      "Do not display as verified; route for teacher review.",
            "translation": translated_text,
            "matched_entry_id": None,
        }

    entry_status = entry.get("status", STATUS_UNVERIFIED)
    if entry_status not in VALID_STATUSES:
        entry_status = STATUS_UNVERIFIED

    if entry_status == STATUS_VERIFIED:
        matches = bool(translated_text) and (
            translated_text.strip() == (entry.get("santali") or "").strip()
            or translated_text.strip() == (entry.get("ol_chiki") or "").strip()
        )
        if matches:
            return {
                "allowed": True,
                "status": STATUS_VERIFIED,
                "confidence": entry.get("confidence", 1.0),
                "reason": "Matches a verified glossary entry.",
                "translation": entry.get("santali") or entry.get("ol_chiki"),
                "matched_entry_id": entry.get("id"),
            }
        # The AI output disagrees with a verified source - never trust the
        # AI over a verified entry. Flag for review instead of approving.
        return {
            "allowed": False,
            "status": STATUS_REVIEW_REQUIRED,
            "confidence": 0.3,
            "reason": "A verified glossary entry exists for this source text, "
                      "but the supplied translation does not match it.",
            "translation": translated_text,
            "matched_entry_id": entry.get("id"),
        }

    if entry_status == STATUS_REVIEW_REQUIRED:
        return {
            "allowed": False,
            "status": STATUS_REVIEW_REQUIRED,
            "confidence": entry.get("confidence", 0.4),
            "reason": "A candidate translation exists but has not yet been "
                      "validated by a native-speaker/linguist reviewer.",
            "translation": entry.get("santali") or entry.get("ol_chiki"),
            "matched_entry_id": entry.get("id"),
        }

    # STATUS_UNVERIFIED
    return {
        "allowed": False,
        "status": STATUS_UNVERIFIED,
        "confidence": 0.0,
        "reason": "Glossary entry exists but has no verified translation yet.",
        "translation": None,
        "matched_entry_id": entry.get("id"),
    }


# ---------------------------------------------------------
# 4. TEACHER CORRECTION
# ---------------------------------------------------------

def build_teacher_correction_record(hindi, ai_santali, corrected_santali,
                                     ol_chiki=None, category=None, context=None,
                                     notes=None, teacher_id=None):
    """
    Build a teacher-correction record. A correction NEVER becomes
    VERIFIED automatically - it always enters as REVIEW_REQUIRED and
    must later be promoted by a separate native-speaker validation
    step (outside the scope of this hackathon prototype).

    This only builds/validates the record; persistence is handled by
    the caller (see routes/language.py) via the TeacherCorrection
    SQLAlchemy model so corrections can be queried later.
    """
    if not hindi or not hindi.strip():
        raise ValueError("hindi is required")
    if not corrected_santali or not corrected_santali.strip():
        raise ValueError("corrected_santali is required")

    return {
        "hindi": hindi.strip(),
        "ai_santali": (ai_santali or "").strip() or None,
        "corrected_santali": corrected_santali.strip(),
        "ol_chiki": (ol_chiki or "").strip() or None,
        "category": category,
        "context": context,
        "notes": notes,
        "teacher_id": teacher_id,
        "status": STATUS_REVIEW_REQUIRED,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


# ---------------------------------------------------------
# 5. LANGUAGE STATUS SUMMARY
# ---------------------------------------------------------

def get_language_status():
    """
    Summarize the current state of the language pack: counts by status
    and by category. Used by M1/M3 to show classroom-readiness at a
    glance, and by the M5 test suite.
    """
    pack = load_language_pack()
    entries = pack["entries"]

    status_counts = {STATUS_VERIFIED: 0, STATUS_REVIEW_REQUIRED: 0, STATUS_UNVERIFIED: 0}
    category_counts = {}

    for e in entries:
        s = e.get("status", STATUS_UNVERIFIED)
        if s in status_counts:
            status_counts[s] += 1
        c = e.get("category")
        if c:
            category_counts[c] = category_counts.get(c, 0) + 1

    return {
        "total_entries": len(entries),
        "status_counts": status_counts,
        "category_counts": category_counts,
        "categories": pack["categories"],
    }
