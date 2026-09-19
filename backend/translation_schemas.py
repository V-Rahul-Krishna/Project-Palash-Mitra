from pydantic import BaseModel


class TranslationRequest(BaseModel):
    text: str
    source_language: str
    target_language: str


class TranslationResponse(BaseModel):
    source_text: str
    translated_text: str
    source_language: str
    target_language: str
    confidence: float
    verification_status: str