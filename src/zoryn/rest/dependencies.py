"""
API dependency providers.

Centralizes access to the persisted knowledge dataset.
"""

from __future__ import annotations

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


@lru_cache(maxsize=1)
def get_repository() -> KnowledgeRepository:
    """
    Return the shared knowledge repository.
    """

    return KnowledgeRepository(
        _KNOWLEDGE,
    )