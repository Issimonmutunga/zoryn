"""
Canonical Living Earth Graph.

This class represents the current interpretation of the Event Store.

It contains no persistence logic.

Its sole responsibility is maintaining the current graph state
as immutable events are applied.
"""

from __future__ import annotations

from collections.abc import Iterable
from uuid import UUID

from zoryn.core.entity import Entity
from zoryn.core.relationship import Relationship

from .graph_engine import GraphEngine


class LivingEarthGraph(GraphEngine):
    """
    In-memory Living Earth Graph.

    This implementation is intentionally minimal.

    Future implementations may replace the internal storage without
    changing the public interface.
    """

    def __init__(self) -> None:
        self.reset()

    def apply(self, event) -> None:
        """
        Apply a single event.

        Event handling will be introduced as the engine evolves.
        """
        return None

    def apply_many(self, events: Iterable) -> None:
        """
        Apply multiple events.
        """
        for event in events:
            self.apply(event)

    def reset(self) -> None:
        """
        Reset the graph to an empty state.
        """
        self._entities: dict[UUID, Entity] = {}
        self._relationships: dict[UUID, Relationship] = {}

    def rebuild(self, events: Iterable) -> None:
        """
        Rebuild the graph from an event stream.
        """
        self.reset()
        self.apply_many(events)

    @property
    def entities(self) -> dict[UUID, Entity]:
        """
        Return all entities.
        """
        return self._entities

    @property
    def relationships(self) -> dict[UUID, Relationship]:
        """
        Return all relationships.
        """
        return self._relationships
