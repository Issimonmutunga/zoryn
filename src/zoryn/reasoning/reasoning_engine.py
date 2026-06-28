"""
Abstract reasoning engine.

Reasoning engines interpret the current state of the Living Earth
Graph together with accumulated memory.

They generate hypotheses, explanations and recommendations.

Reasoning engines never modify the graph directly.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from zoryn.graph.graph_snapshot import GraphSnapshot
from zoryn.memory.memory_manager import MemoryManager


class ReasoningEngine(ABC):
    """
    Base class for reasoning engines.
    """

    @abstractmethod
    def reason(
        self,
        snapshot: GraphSnapshot,
        memory: MemoryManager,
    ) -> None:
        """
        Perform reasoning using the current graph snapshot
        and accumulated memory.
        """
        raise NotImplementedError