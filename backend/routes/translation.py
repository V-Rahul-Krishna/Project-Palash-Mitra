from fastapi import APIRouter

from translation_schemas import (
    TranslationRequest,
    TranslationResponse,
)

router = APIRouter(
    prefix="/translation",
    tags=["Translation"]
)


@router.post("/translate", response_model=TranslationResponse)
def translate_text(request: TranslationRequest):
    return TranslationResponse(
        source_text=request.text,
        translated_text="Translation engine not connected yet.",
        source_language=request.source_language,
        target_language=request.target_language,
        confidence=0.0,
        verification_status="Pending verification",
    )