"""
PALASH MITRA - Santali Language Safety

M5 Module - test suite

Uses an isolated in-memory SQLite database for API tests so nothing
here ever touches the real backend/palash.db.
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from database import Base
import main
from routes import language as language_routes
from services import language_safety

TEST_ENGINE = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=TEST_ENGINE)
Base.metadata.create_all(bind=TEST_ENGINE)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


main.app.dependency_overrides[language_routes.get_db] = override_get_db

client = TestClient(main.app)


# ---------------------------------------------------------
# 1. Verified glossary lookup
# ---------------------------------------------------------

def test_verified_lookup_via_service(monkeypatch):
    fixture_pack = {
        "entries": [
            {
                "id": "fixture-verified-1",
                "hindi": "पानी",
                "santali": "FIXTURE_SANTALI",
                "ol_chiki": "FIXTURE_OLCHIKI",
                "category": "classroom",
                "context": "vocabulary",
                "status": "VERIFIED",
                "confidence": 0.95,
                "source": "unit_test_fixture",
            }
        ],
        "categories": ["classroom"],
        "total_entries": 1,
    }
    monkeypatch.setattr(language_safety, "load_language_pack", lambda: fixture_pack)

    result = language_safety.verify_translation(
        source_lang="hi", target_lang="sat", source_text="पानी",
        translated_text="FIXTURE_SANTALI",
    )
    assert result["allowed"] is True
    assert result["status"] == "VERIFIED"
    assert result["matched_entry_id"] == "fixture-verified-1"


# ---------------------------------------------------------
# 2. unknown phrase
# ---------------------------------------------------------

def test_unknown_phrase_returns_unverified():
    result = language_safety.verify_translation(
        source_lang="hi", target_lang="sat",
        source_text="यह वाक्यांश शब्दकोश में नहीं है",
        translated_text="anything",
    )
    assert result["allowed"] is False
    assert result["status"] == "UNVERIFIED"
    assert result["matched_entry_id"] is None


# ---------------------------------------------------------
# 3. unverified translation (real seed data has no santali value yet)
# ---------------------------------------------------------

def test_seed_entry_is_unverified():
    result = language_safety.verify_translation(
        source_lang="hi", target_lang="sat",
        source_text="नमस्ते", translated_text="anything",
    )
    assert result["status"] == "UNVERIFIED"
    assert result["allowed"] is False


# ---------------------------------------------------------
# 4. REVIEW_REQUIRED translation (seed-0006 synthetic fixture)
# ---------------------------------------------------------

def test_review_required_entry():
    result = language_safety.verify_translation(
        source_lang="hi", target_lang="sat",
        source_text="धन्यवाद", translated_text="anything",
    )
    assert result["status"] == "REVIEW_REQUIRED"
    assert result["allowed"] is False
    assert result["matched_entry_id"] == "seed-0006"


# ---------------------------------------------------------
# 5. confidence/status handling - verified entry whose AI text disagrees
# ---------------------------------------------------------

def test_verified_entry_mismatched_translation_flags_review(monkeypatch):
    fixture_pack = {
        "entries": [
            {
                "id": "fixture-verified-2",
                "hindi": "सूरज",
                "santali": "REAL_VERIFIED_VALUE",
                "status": "VERIFIED",
                "confidence": 0.9,
            }
        ],
        "categories": [],
        "total_entries": 1,
    }
    monkeypatch.setattr(language_safety, "load_language_pack", lambda: fixture_pack)
    result = language_safety.verify_translation(
        source_lang="hi", target_lang="sat", source_text="सूरज",
        translated_text="SOMETHING_ELSE_FROM_AI",
    )
    assert result["status"] == "REVIEW_REQUIRED"
    assert result["allowed"] is False


# ---------------------------------------------------------
# 6. teacher correction
# ---------------------------------------------------------

def test_teacher_correction_endpoint():
    resp = client.post(
        "/language/correction",
        json={
            "hindi": "पेड़",
            "ai_santali": "AI_GUESS",
            "corrected_santali": "TEACHER_CORRECTED_VALUE",
            "category": "environment",
            "context": "vocabulary",
            "notes": "AI mistranslated this; corrected during class.",
            "teacher_id": "teacher-001",
        },
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "REVIEW_REQUIRED"
    assert body["corrected_santali"] == "TEACHER_CORRECTED_VALUE"


# ---------------------------------------------------------
# 7. correction becomes REVIEW_REQUIRED (never auto-VERIFIED)
# ---------------------------------------------------------

def test_correction_never_auto_verified():
    resp = client.post(
        "/language/correction",
        json={"hindi": "चंदा", "corrected_santali": "SOME_CORRECTION"},
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "REVIEW_REQUIRED"
    assert resp.json()["status"] != "VERIFIED"


# ---------------------------------------------------------
# 8. category/context lookup
# ---------------------------------------------------------

def test_category_and_context_filtering():
    results = language_safety.search_glossary(category="numbers")
    assert all(e["category"] == "numbers" for e in results)
    assert len(results) >= 1

    results2 = language_safety.search_glossary(context="lesson_intro")
    assert all(e["context"] == "lesson_intro" for e in results2)


# ---------------------------------------------------------
# 9. malformed input
# ---------------------------------------------------------

def test_malformed_correction_missing_required_field():
    resp = client.post(
        "/language/correction",
        json={"hindi": "", "corrected_santali": ""},
    )
    assert resp.status_code == 422


def test_verify_empty_source_text():
    result = language_safety.verify_translation(
        source_lang="hi", target_lang="sat", source_text="", translated_text="x"
    )
    assert result["status"] == "UNVERIFIED"
    assert result["allowed"] is False


# ---------------------------------------------------------
# 10. API responses
# ---------------------------------------------------------

def test_status_endpoint():
    resp = client.get("/language/status")
    assert resp.status_code == 200
    body = resp.json()
    assert set(body["status_counts"].keys()) == {"VERIFIED", "REVIEW_REQUIRED", "UNVERIFIED"}


def test_verify_endpoint_api():
    resp = client.post(
        "/language/verify",
        json={
            "source_lang": "hi",
            "target_lang": "sat",
            "source_text": "नमस्ते",
            "translated_text": "anything",
        },
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "UNVERIFIED"


# ---------------------------------------------------------
# 11. language-pack loading
# ---------------------------------------------------------

def test_language_pack_endpoint():
    resp = client.get("/language/pack")
    assert resp.status_code == 200
    body = resp.json()
    assert body["total_entries"] >= 8
    assert "greetings" in body["categories"] or "numbers" in body["categories"]


def test_glossary_term_lookup_endpoint():
    resp = client.get("/language/glossary/नमस्ते")
    assert resp.status_code == 200
    assert resp.json()["id"] == "seed-0001"

    resp_missing = client.get("/language/glossary/not-a-real-term-xyz")
    assert resp_missing.status_code == 404
