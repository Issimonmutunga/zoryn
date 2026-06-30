"""
Knowledge lifecycle for Zoryn.
"""

from __future__ import annotations

from .discovery import KnowledgeDiscovery
from .relationship import Relationship
from .store import KnowledgeStore
from .unit import KnowledgeUnit
from .validation import KnowledgeValidator


class KnowledgeLifecycle:
    """
    Coordinates the lifecycle of knowledge units.
    """

    def __init__(self) -> None:
        self.discovery = KnowledgeDiscovery()
        self.validation = KnowledgeValidator()
        self.store = KnowledgeStore()

    def discover(self, relationship: Relationship) -> KnowledgeUnit:
        """
        Discover and store a candidate knowledge unit.
        """
        unit = self.discovery.discover(relationship)
        self.store.add(unit)
        return unit

    def confirm(self, unit: KnowledgeUnit) -> KnowledgeUnit:
        """
        Confirm an existing knowledge unit.
        """
        updated = self.validation.confirm(unit)
        self.store.add(updated)
        return updated

    def contradict(self, unit: KnowledgeUnit) -> KnowledgeUnit:
        """
        Contradict an existing knowledge unit.
        """
        updated = self.validation.contradict(unit)
        self.store.add(updated)
        return updated