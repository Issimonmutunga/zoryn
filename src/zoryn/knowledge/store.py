"""
Knowledge store for Zoryn.
"""

from __future__ import annotations

from .unit import KnowledgeUnit


class KnowledgeStore:
    """
    In-memory collection of knowledge units.
    """

    def __init__(self) -> None:
        self._knowledge: dict[str, KnowledgeUnit] = {}

    def add(self, unit: KnowledgeUnit) -> None:
        """
        Store a knowledge unit.
        """
        self._knowledge[unit.id] = unit

    def get(self, unit_id: str) -> KnowledgeUnit | None:
        """
        Retrieve a knowledge unit by ID.
        """
        return self._knowledge.get(unit_id)

    def all(self) -> list[KnowledgeUnit]:
        """
        Return all knowledge units.
        """
        return list(self._knowledge.values())

    def __len__(self) -> int:
        return len(self._knowledge)