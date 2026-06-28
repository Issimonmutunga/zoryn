"""
Working memory.

Working memory maintains the most recent graph snapshots.

It represents the short-term memory of the Zoryn engine.
"""

from __future__ import annotations

from collections import deque

from zoryn.graph.graph_snapshot import GraphSnapshot


class WorkingMemory:
    """
    Fixed-size working memory.
    """

    def __init__(self, capacity: int = 10) -> None:
        self._capacity = capacity
        self._snapshots: deque[GraphSnapshot] = deque(maxlen=capacity)

    def remember(self, snapshot: GraphSnapshot) -> None:
        """
        Store a graph snapshot.
        """
        self._snapshots.append(snapshot)

    def latest(self) -> GraphSnapshot | None:
        """
        Return the most recent snapshot.
        """
        if not self._snapshots:
            return None

        return self._snapshots[-1]

    def snapshots(self) -> tuple[GraphSnapshot, ...]:
        """
        Return all snapshots in working memory.
        """
        return tuple(self._snapshots)

    def clear(self) -> None:
        """
        Clear working memory.
        """
        self._snapshots.clear()

    def __len__(self) -> int:
        return len(self._snapshots)