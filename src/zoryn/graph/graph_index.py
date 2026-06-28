"""
Graph index.

Provides fast lookup of graph nodes and edges.

The index maintains structural mappings only.

It contains no graph reasoning logic.
"""

from __future__ import annotations

from uuid import UUID

from .edge import Edge
from .node import Node


class GraphIndex:
    """
    Fast lookup index for graph objects.
    """

    def __init__(self) -> None:
        self._nodes: dict[UUID, Node] = {}
        self._edges: dict[UUID, Edge] = {}

    def add_node(self, node: Node) -> None:
        """
        Register a node.
        """
        self._nodes[node.id] = node

    def add_edge(self, edge: Edge) -> None:
        """
        Register an edge.
        """
        self._edges[edge.id] = edge

    def node(self, node_id: UUID) -> Node | None:
        """
        Retrieve a node.
        """
        return self._nodes.get(node_id)

    def edge(self, edge_id: UUID) -> Edge | None:
        """
        Retrieve an edge.
        """
        return self._edges.get(edge_id)

    def has_node(self, node_id: UUID) -> bool:
        """
        Determine whether a node exists.
        """
        return node_id in self._nodes

    def has_edge(self, edge_id: UUID) -> bool:
        """
        Determine whether an edge exists.
        """
        return edge_id in self._edges

    def clear(self) -> None:
        """
        Remove all indexed objects.
        """
        self._nodes.clear()
        self._edges.clear()