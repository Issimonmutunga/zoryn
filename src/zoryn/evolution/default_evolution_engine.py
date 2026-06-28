"""
Default evolution engine.

Coordinates graph evolution using immutable events.

This implementation establishes the execution pipeline.

More sophisticated evolution strategies can be introduced later
without changing the public interface.
"""

from __future__ import annotations

from zoryn.core.event import Event
from zoryn.graph.living_earth_graph import LivingEarthGraph
from zoryn.memory.memory_manager import MemoryManager

from .evolution_engine import EvolutionEngine


class DefaultEvolutionEngine(EvolutionEngine):
    """
    Default implementation of the evolution engine.
    """

    def evolve(
        self,
        graph: LivingEarthGraph,
        memory: MemoryManager,
        event: Event,
    ) -> None:
        """
        Execute one evolution step.

        Current pipeline

        Event
            ↓
        Graph Projection
            ↓
        Snapshot Creation
            ↓
        Working Memory
        """

        graph.apply(event)

        snapshot = graph.snapshot()

        memory.working.remember(snapshot)