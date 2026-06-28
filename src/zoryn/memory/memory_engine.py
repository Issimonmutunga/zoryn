"""
Abstract memory engine.

The memory engine accumulates experience from graph evolution.

It is independent of the graph implementation and storage backend.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from zoryn.graph.graph_snapshot import GraphSnapshot


class MemoryEngine(ABC):
    """
    Base class for memory engines.
    """

    @abstractmethod
    def remember(self, snapshot: GraphSnapshot) -> None:
        """
        Learn from a graph snapshot.
        """
        raise NotImplementedError

    @abstractmethod
    def reset(self) -> None:
        """
        Clear accumulated memory.
        """
        raise NotImplementedError