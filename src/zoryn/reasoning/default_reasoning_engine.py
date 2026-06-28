"""
Default reasoning engine.

The default reasoning engine establishes the reasoning pipeline.

Initially it performs no inference.

Future implementations will discover analogues, generate
hypotheses and explain graph evolution.
"""

from __future__ import annotations

from zoryn.graph.graph_snapshot import GraphSnapshot
from zoryn.memory.memory_manager import MemoryManager

from .reasoning_engine import ReasoningEngine


class DefaultReasoningEngine(ReasoningEngine):
    """
    Default reasoning engine.
    """

    def reason(
        self,
        snapshot: GraphSnapshot,
        memory: MemoryManager,
    ) -> None:
        """
        Perform reasoning.

        Current pipeline

        Graph Snapshot
              ↓
        Working Memory
              ↓
        Episodic Memory
              ↓
        Semantic Memory
              ↓
        Future inference
        """
        return None