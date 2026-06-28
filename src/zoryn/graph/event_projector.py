"""
Abstract event projector.

Event projectors transform immutable events into updates to the
Living Earth Graph.

Projectors never mutate the graph directly.

All graph modifications occur through the GraphMutator.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from zoryn.core.event import Event

from .graph_mutator import GraphMutator


class EventProjector(ABC):
    """
    Base class for all event projectors.
    """

    def __init__(self, mutator: GraphMutator) -> None:
        self._mutator = mutator

    @abstractmethod
    def project(self, event: Event) -> None:
        """
        Project an immutable event into graph mutations.

        Parameters
        ----------
        event
            Event to project into the Living Earth Graph.
        """
        raise NotImplementedError