"""
Abstract evolution engine.

The evolution engine coordinates the transition from one graph
state to the next.

It consumes immutable events and evolves both the Living Earth
Graph and the memory systems.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from zoryn.core.event import Event
from zoryn.graph.living_earth_graph import LivingEarthGraph
from zoryn.memory.memory_manager import MemoryManager


class EvolutionEngine(ABC):
    """
    Base class for graph evolution engines.
    """

    @abstractmethod
    def evolve(
        self,
        graph: LivingEarthGraph,
        memory: MemoryManager,
        event: Event,
    ) -> None:
        """
        Evolve the graph and memory using a single event.
        """
        raise NotImplementedError