"""
Canonical graph edge.

Edges connect nodes within the Living Earth Graph.

Edges are immutable.

They describe structural relationships independently of the
domain objects they connect.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any
from uuid import UUID

from zoryn.core.identifiers import new_id


@dataclass(frozen=True, slots=True)
class Edge:
    """
    Immutable graph edge.

    Parameters
    ----------
    source_node_id
        Identifier of the source node.
    target_node_id
        Identifier of the target node.
    edge_type
        Logical type of the relationship.
    properties
        Optional edge properties.
    """

    source_node_id: UUID
    target_node_id: UUID
    edge_type: str

    properties: dict[str, Any] = field(default_factory=dict)

    id: UUID = field(default_factory=new_id)