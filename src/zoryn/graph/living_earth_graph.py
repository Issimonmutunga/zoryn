"""
Living Earth Graph.

The Living Earth Graph is the current interpretation of the
Event Store.

Its responsibility is to coordinate graph evolution.

Graph mutations are delegated to the GraphMutator.

Event interpretation is delegated to the ProjectionEngine.
"""

from __future__ import annotations

from collections.abc import Iterable
from datetime import UTC, datetime
from uuid import UUID, uuid4

from zoryn.core.event import Event

from .edge import Edge
from .graph_engine import GraphEngine
from .graph_mutator import GraphMutator
from .graph_snapshot import GraphSnapshot
from .node import Node
from .projection_engine import ProjectionEngine


class LivingEarthGraph(GraphEngine):
    """
    In-memory Living Earth Graph.
    """

    def __init__(self) -> None:
        self._nodes: dict[UUID, Node] = {}
        self._edges: dict[UUID, Edge] = {}

        self._version = 0

        self._mutator = GraphMutator(
            self._nodes,
            self._edges,
        )

        self._projection_engine = ProjectionEngine()

    @property
    def mutator(self) -> GraphMutator:
        """
        Return the graph mutator.
        """
        return self._mutator

    @property
    def projection_engine(self) -> ProjectionEngine:
        """
        Return the projection engine.
        """
        return self._projection_engine

    def apply(self, event: Event) -> None:
        """
        Apply an immutable event.
        """
        self._projection_engine.project(event)
        self._version += 1

    def apply_many(self, events: Iterable[Event]) -> None:
        """
        Apply multiple events.
        """
        for event in events:
            self.apply(event)

    def reset(self) -> None:
        """
        Reset the graph.
        """
        self._nodes.clear()
        self._edges.clear()
        self._version = 0

    def rebuild(self, events: Iterable[Event]) -> None:
        """
        Rebuild the graph from an event stream.
        """
        self.reset()
        self.apply_many(events)

    def snapshot(self) -> GraphSnapshot:
        """
        Create an immutable snapshot of the graph.
        """
        return GraphSnapshot(
            version=self._version,
            timestamp=datetime.now(UTC),
            nodes=tuple(self._nodes.values()),
            edges=tuple(self._edges.values()),
            id=uuid4(),
        )

    @property
    def nodes(self) -> dict[UUID, Node]:
        """
        Return graph nodes.
        """
        return self._nodes

    @property
    def edges(self) -> dict[UUID, Edge]:
        """
        Return graph edges.
        """
        return self._edges