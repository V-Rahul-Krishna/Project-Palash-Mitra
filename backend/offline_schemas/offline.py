"""
backend/schemas/offline.py

Pydantic request/response models for the M6 Offline API
(backend/routes/offline.py).
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------
# Lesson caching
# ---------------------------------------------------------------------

class LessonCacheRequest(BaseModel):
    lesson_id: str = Field(..., example="lesson_101")
    title: str = Field(..., example="Intro to Fractions")
    content: Dict[str, Any] = Field(
        ..., example={"body": "A fraction represents part of a whole.", "questions": []}
    )


class LessonCacheResponse(BaseModel):
    message: str
    lesson_id: str
    cached_at: str


class CachedLessonSummary(BaseModel):
    lesson_id: str
    title: str
    cached_at: str


class CachedLessonsListResponse(BaseModel):
    count: int
    lessons: List[CachedLessonSummary]


class CachedLessonDetailResponse(BaseModel):
    lesson_id: str
    title: str
    content: Dict[str, Any]
    cached_at: str


# ---------------------------------------------------------------------
# Sync queue
# ---------------------------------------------------------------------

class SyncQueueRequest(BaseModel):
    action_type: str = Field(..., example="lesson_completed")
    payload: Dict[str, Any] = Field(
        ..., example={"student_id": "stu_001", "lesson_id": "lesson_101", "score": 8}
    )


class SyncQueueResponse(BaseModel):
    message: str
    operation_id: str
    status: str


class SyncOperationSummary(BaseModel):
    operation_id: str
    action_type: str
    payload: Dict[str, Any]
    status: str
    created_at: str
    synced_at: Optional[str] = None


class PendingSyncResponse(BaseModel):
    count: int
    operations: List[SyncOperationSummary]


class SyncResultResponse(BaseModel):
    message: str
    synced_count: int
    failed_count: int
    operations: List[SyncOperationSummary]


# ---------------------------------------------------------------------
# Status
# ---------------------------------------------------------------------

class OfflineStatusResponse(BaseModel):
    status: str
    cache_mode: str
    cached_lessons_count: int
    pending_sync_count: int
    synced_count: int