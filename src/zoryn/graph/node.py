"""
Canonical graph node.

A graph node is the structural representation of an object
inside the Living Earth Graph.

Nodes are immutable.

They reference domain objects (Entity, State, Episode,
Hypothesis, etc.) without depending on their implementations.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any
from uuid import UUID

from zoryn.core.identifiers import new_id


@dataclass(frozen=True, slots=True)
class Node:
    """
    Immutable graph node.

    Parameters
    ----------
    object_id
        Identifier of the referenced domain object.
    object_type
        Logical type of the referenced object.
    properties
        Optional graph-specific properties.
    """

    object_id: UUID
    object_type: str

    properties: dict[str, Any] = field(default_factory=dict)

    id: UUID = field(default_factory=new_id)