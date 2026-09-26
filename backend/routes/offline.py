"""
backend/routes/offline.py

REST API endpoints for the M6 Offline foundation.

This router is intentionally independent from routes/analytics.py.
It does not import or modify analytics/service.py or routes/analytics.py.
"""

from fastapi import APIRouter, HTTPException

from offline.service import offline_service
from offline_schemas.offline import (
    LessonCacheRequest,
    LessonCacheResponse,
    CachedLessonsListResponse,
    CachedLessonDetailResponse,
    SyncQueueRequest,
    SyncQueueResponse,
    PendingSyncResponse,
    SyncResultResponse,
    OfflineStatusResponse,
)

router = APIRouter(prefix="/offline", tags=["Offline"])


@router.get("/status", response_model=OfflineStatusResponse)
def get_offline_status():
    """Return current offline cache + sync queue status."""
    return offline_service.get_status()


@router.post("/cache/lesson", response_model=LessonCacheResponse)
def cache_lesson(request: LessonCacheRequest):
    """Cache a lesson locally so it is available offline."""
    cached = offline_service.cache_lesson(
        lesson_id=request.lesson_id,
        title=request.title,
        content=request.content,
    )
    return {
        "message": "Lesson cached successfully",
        "lesson_id": cached["lesson_id"],
        "cached_at": cached["cached_at"],
    }


@router.get("/cache/lessons", response_model=CachedLessonsListResponse)
def get_cached_lessons():
    """List all lessons currently cached for offline use."""
    lessons = offline_service.get_cached_lessons()
    return {"count": len(lessons), "lessons": lessons}


@router.get("/cache/lessons/{lesson_id}", response_model=CachedLessonDetailResponse)
def get_cached_lesson(lesson_id: str):
    """Get one cached lesson's full content, by lesson_id."""
    lesson = offline_service.get_cached_lesson(lesson_id)
    if lesson is None:
        raise HTTPException(
            status_code=404,
            detail=f"No cached lesson found with lesson_id '{lesson_id}'",
        )
    return lesson


@router.post("/sync/queue", response_model=SyncQueueResponse)
def queue_sync_action(request: SyncQueueRequest):
    """Record an action performed while offline, to sync later."""
    operation = offline_service.queue_action(
        action_type=request.action_type,
        payload=request.payload,
    )
    return {
        "message": "Action queued for sync",
        "operation_id": operation["operation_id"],
        "status": operation["status"],
    }


@router.get("/sync/pending", response_model=PendingSyncResponse)
def get_pending_sync():
    """List every operation still waiting to be synced."""
    operations = offline_service.get_pending_operations()
    return {"count": len(operations), "operations": operations}


@router.post("/sync", response_model=SyncResultResponse)
def sync_pending_operations():
    """Sync all pending operations now that connectivity is back."""
    result = offline_service.sync_pending()
    return {
        "message": f"Sync complete: {result['synced_count']} operation(s) synced",
        "synced_count": result["synced_count"],
        "failed_count": result["failed_count"],
        "operations": result["operations"],
    }