"""
Immutable graph snapshot.

A snapshot represents the state of the Living Earth Graph
at a particular point in its evolution.

Snapshots are lightweight views over graph objects.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from .edge import Edge
from .node import Node


@dataclass(frozen=True, slots=True)
class GraphSnapshot:
    """
    Immutable snapshot of the Living Earth Graph.

    Parameters
    ----------
    version
        Monotonically increasing graph version.
    timestamp
        Time the snapshot was created.
    nodes
        Graph nodes.
    edges
        Graph edges.
    """

    version: int
    timestamp: datetime

    nodes: tuple[Node, ...]
    edges: tuple[Edge, ...]

    id: UUID