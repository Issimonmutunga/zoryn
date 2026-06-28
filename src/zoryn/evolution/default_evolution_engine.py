"""
Default evolution engine.

Coordinates one complete evolution cycle.

Event
    ↓
Graph
    ↓
Snapshot
    ↓
Memory
    ↓
Reasoning
"""

from __future__ import annotations

from zoryn.core.event import Event
from zoryn.graph.living_earth_graph import LivingEarthGraph
from zoryn.memory.memory_manager import MemoryManager
from zoryn.reasoning.reasoning_engine import ReasoningEngine

from .evolution_engine import EvolutionEngine


class DefaultEvolutionEngine(EvolutionEngine):
    """
    Default implementation of the evolution engine.
    """

    def __init__(
        self,
        reasoning: ReasoningEngine,
    ) -> None:
        self._reasoning = reasoning

    def evolve(
        self,
        graph: LivingEarthGraph,
        memory: MemoryManager,
        event: Event,
    ) -> None:
        """
        Execute one complete evolution cycle.
        """

        graph.apply(event)

        snapshot = graph.snapshot()

        memory.working.remember(snapshot)

        self._reasoning.reason(
            snapshot=snapshot,
            memory=memory,
        )