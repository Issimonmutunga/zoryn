"""
Memory manager.

Coordinates the different memory systems that together form
Zoryn's long-term memory.

The manager orchestrates memory but does not implement
reasoning algorithms.
"""

from __future__ import annotations

from .analogue_memory import AnalogueMemory
from .episode_memory import EpisodeMemory
from .semantic_memory import SemanticMemory
from .trajectory_memory import TrajectoryMemory
from .working_memory import WorkingMemory


class MemoryManager:
    """
    Coordinates all memory systems.
    """

    def __init__(self) -> None:
        self.working = WorkingMemory()
        self.episodes = EpisodeMemory()
        self.trajectories = TrajectoryMemory()
        self.analogues = AnalogueMemory()
        self.semantic = SemanticMemory()

    def clear(self) -> None:
        """
        Clear every memory system.
        """
        self.working.clear()
        self.episodes.clear()
        self.trajectories.clear()
        self.analogues.clear()
        self.semantic.clear()