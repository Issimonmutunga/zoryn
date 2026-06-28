"""
Base event handler.

Every event type in Zoryn is processed by a dedicated handler.

Handlers encapsulate graph update logic and operate through the
GraphMutator only.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from zoryn.core.event import Event

from .graph_mutator import GraphMutator


class EventHandler(ABC):
    """
    Base class for all event handlers.
    """

    def __init__(self, mutator: GraphMutator) -> None:
        self._mutator = mutator

    @abstractmethod
    def handle(self, event: Event) -> None:
        """
        Process an event and update the graph.

        Parameters
        ----------
        event
            Immutable event to process.
        """
        raise NotImplementedError