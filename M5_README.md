# M5 - Santali Language Safety

This module guards every Hindi <-> Santali translation before it reaches a
classroom. **AI confidence is never treated as linguistic truth.** A
translation is only `VERIFIED` when it matches a glossary entry that a
native-speaker/linguist reviewer has already signed off on.

```
AI Translation (M2)
      |
      v
M5 Language Safety   <-- you are here
      |
      v
Glossary / Verification
      |
      v
Confidence + Status
      |
      v
Classroom Delivery (M1 / M3)
```

## Files added by M5

| File | Purpose |
|---|---|
| `backend/data/santali/glossary.json` | Verified-glossary data store |
| `backend/data/santali/classroom_phrases.json` | Classroom-phrase / curriculum-terminology data store |
| `backend/services/language_safety.py` | Core safety logic (pure functions, no FastAPI/DB dependency) |
| `backend/routes/language.py` | FastAPI routes exposing the service |
| `backend/tests/test_language_safety.py` | Test suite (14 tests) |

## Files modified by M5 (minimal, additive only)

| File | Change |
|---|---|
| `backend/models.py` | Added `TeacherCorrection` SQLAlchemy model. `Lesson` untouched. |
| `backend/schemas.py` | Added M5 Pydantic schemas. `LessonCreate`/`LessonResponse` untouched. |
| `backend/main.py` | Two lines: import + `include_router` for the new `language_router`. |

Nothing in `routes/lessons.py`, the DB connection setup, CORS config, or any
other member's code was changed.

## CRITICAL: no real Santali data is included

Every entry in `glossary.json` / `classroom_phrases.json` is a
**`SEED_PLACEHOLDER`**, marked `UNVERIFIED` (or, for one synthetic test
fixture, `REVIEW_REQUIRED` with an obviously non-linguistic placeholder
value). **None of it is a real translation.** This was a deliberate choice:
I do not have an authoritative Santali/Ol Chiki source to draw from, and
inventing translations and labelling them as verified would be actively
dangerous in a classroom tool. Real entries must be added by a
native-speaker/linguist reviewer.

## Language pack schema

Every entry (glossary or classroom phrase) follows this shape:

```json
{
  "id": "seed-0001",
  "hindi": "नमस्ते",
  "santali": null,
  "ol_chiki": null,
  "transliteration": null,
  "category": "greetings",
  "context": "classroom_opening",
  "status": "UNVERIFIED",
  "confidence": 0.0,
  "source": "SEED_PLACEHOLDER",
  "reviewer": null,
  "notes": "..."
}
```

Categories currently used: `greetings`, `classroom_commands`, `numbers`,
`school_objects`, `classroom`, `curriculum`, `teacher_instructions`. Add more
as needed - nothing in the code hardcodes the category list.

## Verification statuses

- **VERIFIED** - matches a glossary entry that a reviewer has confirmed.
- **REVIEW_REQUIRED** - a candidate exists (e.g. from a teacher correction)
  but has not yet been validated by a native speaker.
- **UNVERIFIED** - no trustworthy entry exists at all.

`verify_translation()` never upgrades AI output to `VERIFIED` on its own,
and if AI output disagrees with an already-`VERIFIED` entry, it is flagged
`REVIEW_REQUIRED` rather than trusted.

## Teacher-correction workflow

```
AI translation -> teacher correction -> REVIEW_REQUIRED -> native-speaker validation -> VERIFIED
```

`POST /language/correction` always creates a `REVIEW_REQUIRED` row in the
`teacher_corrections` table. Nothing in this module can promote a
correction to `VERIFIED` - that promotion step (writing a reviewed entry
into the glossary JSON, or into a future `glossary` DB table) is
intentionally left as a separate, out-of-scope step for a native-speaker
reviewer / project lead to perform.

No authentication system exists yet in the project, so `teacher_id` is a
free-text field for now. If/when M1 adds auth, wire the authenticated
user's ID into that field instead.

## API endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/language/pack` | Full merged language pack |
| GET | `/language/glossary?query=&category=&context=&status=` | Search |
| GET | `/language/glossary/{term}` | Exact lookup by Hindi term |
| POST | `/language/verify` | Verify an AI translation |
| POST | `/language/correction` | Submit a teacher correction |
| GET | `/language/corrections?status=` | List submitted corrections |
| GET | `/language/status` | Status/category counts |

### Example: verify

Request:
```json
POST /language/verify
{
  "source_lang": "hi",
  "target_lang": "sat",
  "source_text": "नमस्ते",
  "translated_text": "..."
}
```

Response:
```json
{
  "allowed": false,
  "status": "UNVERIFIED",
  "confidence": 0.0,
  "reason": "Glossary entry exists but has no verified translation yet.",
  "translation": null,
  "matched_entry_id": "seed-0001"
}
```

### Example: teacher correction

Request:
```json
POST /language/correction
{
  "hindi": "पेड़",
  "ai_santali": "AI's guess",
  "corrected_santali": "Teacher's corrected value",
  "category": "environment",
  "context": "vocabulary",
  "teacher_id": "teacher-001"
}
```

Response includes `"status": "REVIEW_REQUIRED"` always.

## Integration for M1 / M2 / M3

**M2 (translation engine):** once `services/translation.py` exists, call
`language_safety.verify_translation(source_lang, target_lang, source_text,
translated_text, category, context)` with whatever M2's model produces.
M5 does not call M2 and has no import-time dependency on it - the interface
is a plain function, so it can be wired in whenever M2's engine is ready.

**M1 / M3 (classroom delivery):** use `GET /language/status` to show
overall glossary readiness, `GET /language/pack` or `/language/glossary` to
render a language pack in the UI, and always check `allowed` /
`status` from `/language/verify` before displaying a translation as
correct - never display an `UNVERIFIED` or `REVIEW_REQUIRED` item as if it
were confirmed.

## Tests

`backend/tests/test_language_safety.py` - 14 tests, all passing as of this
writing:

1. Verified glossary lookup
2. Unknown phrase -> UNVERIFIED
3. Unverified seed entry
4. REVIEW_REQUIRED entry
5. Verified entry vs. mismatched AI output -> flagged REVIEW_REQUIRED
6. Teacher correction submission
7. Correction never auto-VERIFIED
8. Category / context filtering
9. Malformed input (missing required fields) -> 422
10. Empty source_text handling
11. `/language/status` API
12. `/language/verify` API
13. `/language/pack` API + entry count
14. `/language/glossary/{term}` lookup + 404 on miss

Run with:
```bash
cd backend
pip install fastapi uvicorn sqlalchemy pydantic pytest httpx
python -m pytest tests/ -v
```

Tests use an isolated in-memory SQLite database (via SQLAlchemy's
`StaticPool`) - they never touch `backend/palash.db`.

## Known limitations / what's still needed

- No real Santali/Ol Chiki vocabulary exists yet - the glossary is an empty
  schema waiting for native-speaker input.
- No promotion path from `REVIEW_REQUIRED` -> `VERIFIED` is implemented
  (e.g. an admin/reviewer endpoint) - intentionally out of scope until the
  team decides who is authorized to validate entries and how.
- No auth system exists in the project yet, so `teacher_id` is unauthenticated
  free text.
- M2's translation engine doesn't exist yet, so `verify_translation()` has
  not been exercised against real AI output - only against the local
  glossary, which is exactly the integration seam M2 is expected to use.
