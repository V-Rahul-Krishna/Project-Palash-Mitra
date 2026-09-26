"""
backend/offline/service.py

Offline foundation service for M6 (Analytics + Offline).

This module provides a simple, swappable in-memory implementation for:
- Caching lesson data for offline access
- Queuing actions/operations performed while offline
- "Syncing" those queued operations once connectivity returns

IMPORTANT LIMITATION (read this first):
This first version stores everything in memory (plain Python dicts/lists).
That means:
    - All cached lessons and queued sync operations are LOST whenever
      the FastAPI/Uvicorn process restarts.
    - This is intentional for a first "offline foundation" version.
    - It is NOT meant to be the final, production-ready implementation.

UPGRADE PATH (for later):
    - Replace the in-memory dicts in OfflineService with:
        a) New SQLAlchemy models (e.g. CachedLesson, SyncOperation) in a
           NEW file such as backend/offline/models.py, then use
           database.py's SessionLocal to persist rows, OR
        b) Client-side storage (e.g. browser IndexedDB/localStorage) if
           the frontend team wants caching to live on the device.
    - Because all reads/writes go through the OfflineService class
      methods (not directly through route handlers), you only need to
      change the INSIDE of these methods later. The method signatures,
      and therefore routes/offline.py and the REST API itself, do not
      need to change.
"""

from datetime import datetime, timezone
from typing import Dict, List, Optional
import uuid


class OfflineService:
    """
    In-memory offline cache + sync queue manager.

    Swap the internals of this class later for persistent storage
    without changing the public method signatures used by the routes.
    """

    def __init__(self) -> None:
        # lesson_id -> lesson dict (includes title, content, cached_at)
        self._lesson_cache: Dict[str, dict] = {}

        # operation_id -> operation dict (pending sync operations)
        self._pending_queue: Dict[str, dict] = {}

        # operation_id -> operation dict (already synced operations)
        self._synced_operations: Dict[str, dict] = {}

    # ---------------------------------------------------------------
    # Lesson caching
    # ---------------------------------------------------------------

    def cache_lesson(self, lesson_id: str, title: str, content: dict) -> dict:
        """Store (or overwrite) a lesson in the offline cache."""
        cached_lesson = {
            "lesson_id": lesson_id,
            "title": title,
            "content": content,
            "cached_at": datetime.now(timezone.utc).isoformat(),
        }
        self._lesson_cache[lesson_id] = cached_lesson
        return cached_lesson

    def get_cached_lessons(self) -> List[dict]:
        """Return summaries (not full content) of every cached lesson."""
        return [
            {
                "lesson_id": lesson["lesson_id"],
                "title": lesson["title"],
                "cached_at": lesson["cached_at"],
            }
            for lesson in self._lesson_cache.values()
        ]

    def get_cached_lesson(self, lesson_id: str) -> Optional[dict]:
        """Return the full cached lesson (with content), or None."""
        return self._lesson_cache.get(lesson_id)

    # ---------------------------------------------------------------
    # Sync queue (actions recorded while offline)
    # ---------------------------------------------------------------

    def queue_action(self, action_type: str, payload: dict) -> dict:
        """Record an action that happened while offline, to sync later."""
        operation_id = str(uuid.uuid4())
        operation = {
            "operation_id": operation_id,
            "action_type": action_type,
            "payload": payload,
            "status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "synced_at": None,
        }
        self._pending_queue[operation_id] = operation
        return operation

    def get_pending_operations(self) -> List[dict]:
        """Return all operations still waiting to be synced."""
        return list(self._pending_queue.values())

    def sync_pending(self) -> dict:
        """
        Simulate syncing every pending operation.

        In this foundation version, "syncing" just means marking each
        pending operation as synced and moving it out of the pending
        queue. A real implementation would instead send each operation
        to the relevant backend module (e.g. assessments, lessons) here.
        """
        synced_now: List[dict] = []

        for operation_id, operation in list(self._pending_queue.items()):
            operation["status"] = "synced"
            operation["synced_at"] = datetime.now(timezone.utc).isoformat()

            self._synced_operations[operation_id] = operation
            synced_now.append(operation)

            del self._pending_queue[operation_id]

        return {
            "synced_count": len(synced_now),
            "failed_count": 0,
            "operations": synced_now,
        }

    # ---------------------------------------------------------------
    # Status
    # ---------------------------------------------------------------

    def get_status(self) -> dict:
        """Return a snapshot of the current offline subsystem state."""
        return {
            "status": "ok",
            "cache_mode": "in-memory",
            "cached_lessons_count": len(self._lesson_cache),
            "pending_sync_count": len(self._pending_queue),
            "synced_count": len(self._synced_operations),
        }


# Single shared instance used by routes/offline.py.
# This acts like a simple in-process "singleton" for now.
offline_service = OfflineService()