"""
API dependency providers.

Centralizes access to the persisted knowledge dataset.
"""

from __future__ import annotations

import os
import psutil

from functools import lru_cache
from pathlib import Path

from .repository import KnowledgeRepository


_PROJECT_ROOT = (
    Path(__file__)
    .resolve()
    .parents[3]
)

_KNOWLEDGE = (
    _PROJECT_ROOT
    / "data"
    / "processed"
    / "knowledge"
)

_PROCESS = psutil.Process(os.getpid())


def log_memory(stage: str) -> None:
    rss = _PROCESS.memory_info().rss / (1024 * 1024)
    print(f"[MEM] {stage}: {rss:.1f} MB")


@lru_cache(maxsize=1)
def get_repository() -> KnowledgeRepository:
    """
    Return the shared knowledge repository.
    """

    log_memory("Before KnowledgeRepository")

    repository = KnowledgeRepository(
        _KNOWLEDGE,
    )

    log_memory("After KnowledgeRepository")

    return repository