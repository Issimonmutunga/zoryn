"""
Zoryn Engine.

The Zoryn Engine is the public entry point to the framework.

It coordinates the Event Store, Living Earth Graph, Memory,
Evolution and Reasoning.

Clients interact with this class rather than individual
subsystems.
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
    Coordinates the execution of the Zoryn framework.
    """

    def __init__(
        self,
        event_store: EventStore,
    ) -> None:
        self._event_store = event_store

        self._graph = LivingEarthGraph()
        self._memory = MemoryManager()

        self._evolution = DefaultEvolutionEngine()
        self._reasoning = DefaultReasoningEngine()

    @property
    def graph(self) -> LivingEarthGraph:
        return self._graph

    @property
    def memory(self) -> MemoryManager:
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

        snapshot = self._graph.snapshot()

        self._reasoning.reason(
            snapshot=snapshot,
            memory=self._memory,
        )

    def replay(self) -> None:
        """
        Replay the complete Event Store.
        """
        self._graph.reset()
        self._memory.clear()

        for event in self._event_store.replay():
            self._evolution.evolve(
                graph=self._graph,
                memory=self._memory,
                event=event,
            )

        snapshot = self._graph.snapshot()

        self._reasoning.reason(
            snapshot=snapshot,
            memory=self._memory,
        )