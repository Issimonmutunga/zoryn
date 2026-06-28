"""
Zoryn Engine.

The Zoryn Engine is the public entry point to the framework.

Its responsibility is limited to coordinating high-level
execution.

Detailed orchestration is delegated to the Evolution Engine.
"""

from __future__ import annotations

from zoryn.core.event import Event
from zoryn.evolution.default_evolution_engine import DefaultEvolutionEngine
from zoryn.graph.living_earth_graph import LivingEarthGraph
from zoryn.memory.memory_manager import MemoryManager
from zoryn.reasoning.default_reasoning_engine import DefaultReasoningEngine
from zoryn.storage.event_store import EventStore


class ZorynEngine:
    """
    Public interface to the Zoryn framework.
    """

    def __init__(
        self,
        event_store: EventStore,
    ) -> None:
        self._event_store = event_store

        self._graph = LivingEarthGraph()
        self._memory = MemoryManager()

        reasoning = DefaultReasoningEngine()

        self._evolution = DefaultEvolutionEngine(
            reasoning=reasoning,
        )

    @property
    def graph(self) -> LivingEarthGraph:
        """
        Return the Living Earth Graph.
        """
        return self._graph

    @property
    def memory(self) -> MemoryManager:
        """
        Return the memory manager.
        """
        return self._memory

    def ingest(self, event: Event) -> None:
        """
        Ingest a single event.
        """
        self._event_store.append(event)

        self._evolution.evolve(
            graph=self._graph,
            memory=self._memory,
            event=event,
        )

    def replay(self) -> None:
        """
        Replay all recorded events.
        """
        self._graph.reset()
        self._memory.clear()

        for event in self._event_store.replay():
            self._evolution.evolve(
                graph=self._graph,
                memory=self._memory,
                event=event,
            )