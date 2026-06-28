"""
Abstract Living Earth Graph engine.

Graph implementations consume immutable events and evolve the
current interpretation of the Earth's state.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Iterable

from zoryn.core.event import Event


class GraphEngine(ABC):
    """
    Abstract Living Earth Graph engine.
    """

    @abstractmethod
    def apply(self, event: Event) -> None:
        """
        Apply a single event to the graph.
        """
        raise NotImplementedError

    @abstractmethod
    def apply_many(self, events: Iterable[Event]) -> None:
        """
        Apply multiple events to the graph.
        """
        raise NotImplementedError

    @abstractmethod
    def reset(self) -> None:
        """
        Reset the graph to an empty state.
        """
        raise NotImplementedError

    @abstractmethod
    def rebuild(self, events: Iterable[Event]) -> None:
        """
        Rebuild the graph by replaying an event stream.
        """
        raise NotImplementedError