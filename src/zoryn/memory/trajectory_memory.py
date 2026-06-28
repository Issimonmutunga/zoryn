"""
Trajectory memory.

Trajectory memory stores the evolution of graph objects through time.

Trajectories are later used for similarity search, analogue
discovery and forecasting.
"""

from __future__ import annotations

from collections import defaultdict
from uuid import UUID

from zoryn.graph.graph_snapshot import GraphSnapshot


class TrajectoryMemory:
    """
    Long-term trajectory memory.
    """

    def __init__(self) -> None:
        self._trajectories: dict[UUID, list[GraphSnapshot]] = defaultdict(list)

    def remember(
        self,
        object_id: UUID,
        snapshot: GraphSnapshot,
    ) -> None:
        """
        Append a snapshot to an object's trajectory.
        """
        self._trajectories[object_id].append(snapshot)

    def trajectory(
        self,
        object_id: UUID,
    ) -> tuple[GraphSnapshot, ...]:
        """
        Return an object's trajectory.
        """
        return tuple(self._trajectories.get(object_id, ()))

    def contains(self, object_id: UUID) -> bool:
        """
        Determine whether a trajectory exists.
        """
        return object_id in self._trajectories

    def clear(self) -> None:
        """
        Remove all trajectories.
        """
        self._trajectories.clear()

    def __len__(self) -> int:
        return len(self._trajectories)