"""
Analogue memory.

Analogue memory indexes trajectories that may later be searched
for similar historical evolution.

It does not perform similarity search itself.

Reasoning engines are responsible for discovering analogues.
"""

from __future__ import annotations

from uuid import UUID

from .trajectory_memory import TrajectoryMemory


class AnalogueMemory:
    """
    Index of trajectories available for analogue search.
    """

    def __init__(self) -> None:
        self._trajectory_ids: set[UUID] = set()

    def index(
        self,
        object_id: UUID,
        trajectories: TrajectoryMemory,
    ) -> None:
        """
        Register a trajectory for analogue search.
        """
        if trajectories.contains(object_id):
            self._trajectory_ids.add(object_id)

    def indexed(self) -> tuple[UUID, ...]:
        """
        Return indexed trajectory identifiers.
        """
        return tuple(self._trajectory_ids)

    def contains(
        self,
        object_id: UUID,
    ) -> bool:
        """
        Determine whether a trajectory has been indexed.
        """
        return object_id in self._trajectory_ids

    def clear(self) -> None:
        """
        Remove all indexed trajectories.
        """
        self._trajectory_ids.clear()

    def __len__(self) -> int:
        return len(self._trajectory_ids)