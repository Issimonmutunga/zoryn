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
        Ensure every discovered relationship exists in the
        knowledge base.
        """

        units: list[KnowledgeUnit] = []

        for relationship in relationships:
            unit = self._find(relationship)

            if unit is None:
                unit = self.lifecycle.discover(relationship)

            units.append(unit)

        return units

    def confirm(
        self,
        unit: KnowledgeUnit,
    ) -> KnowledgeUnit:
        """
        Persist a confirmed knowledge unit.
        """

        updated = self.lifecycle.confirm(unit)

        return updated

    def contradict(
        self,
        unit: KnowledgeUnit,
    ) -> KnowledgeUnit:
        """
        Persist a contradicted knowledge unit.
        """

        updated = self.lifecycle.contradict(unit)

        return updated

    def all(self) -> list[KnowledgeUnit]:
        """
        Return the current knowledge base.
        """

        return self.lifecycle.store.all()

    def _find(
        self,
        relationship: Relationship,
    ) -> KnowledgeUnit | None:
        """
        Find an existing knowledge unit.
        """

        for unit in self.lifecycle.store.all():
            if unit.relationship == relationship:
                return unit

        return None