"""
Knowledge engine for Zoryn.
"""

from __future__ import annotations

from .lifecycle import KnowledgeLifecycle
from .relationship import Relationship


class KnowledgeEngine:
    """
    Maintains the evolving knowledge base.
    """

    def __init__(self) -> None:
        self.lifecycle = KnowledgeLifecycle()

    def learn(
        self,
        relationships: list[Relationship],
    ):
        """
        Convert discovered relationships into
        candidate knowledge.
        """

        units = []

        for relationship in relationships:
            unit = self.lifecycle.discover(relationship)
            units.append(unit)

        return units