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
from uuid import UUID

from zoryn.core.event import Event

from .edge import Edge
from .graph_engine import GraphEngine
from .graph_mutator import GraphMutator
from .node import Node
from .projection_engine import ProjectionEngine


class LivingEarthGraph(GraphEngine):
    """
    In-memory Living Earth Graph.
    """

    def __init__(self) -> None:
        self._nodes: dict[UUID, Node] = {}
        self._edges: dict[UUID, Edge] = {}

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

    def rebuild(self, events: Iterable[Event]) -> None:
        """
        Rebuild the graph from an event stream.
        """
        self.reset()
        self.apply_many(events)

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