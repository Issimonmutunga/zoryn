"""
Knowledge engine for Zoryn.
"""

from __future__ import annotations

from .lifecycle import KnowledgeLifecycle
from .relationship import Relationship
from .unit import KnowledgeUnit


class KnowledgeEngine:
    """
    Maintains the evolving knowledge base.
    """

    def __init__(self) -> None:
        self.lifecycle = KnowledgeLifecycle()

    def learn(
        self,
        relationships: list[Relationship],
    ) -> list[KnowledgeUnit]:
        """
        Learn from discovered relationships.

        Existing relationships are reused.
        New relationships become candidate knowledge.
        """

        learned: list[KnowledgeUnit] = []

        for relationship in relationships:
            existing = self._find(relationship)

            if existing is None:
                existing = self.lifecycle.discover(relationship)

            learned.append(existing)

        return learned

    def _find(
        self,
        relationship: Relationship,
    ) -> KnowledgeUnit | None:
        """
        Find an existing knowledge unit for a relationship.
        """

        for unit in self.lifecycle.store.all():
            if unit.relationship == relationship:
                return unit

        return None