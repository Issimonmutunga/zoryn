"""
Canonical relationship definition.

Relationships connect objects within the Living Earth Graph.

Relationships are immutable and versioned through replacement.

A relationship may connect any two graph objects.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any
from uuid import UUID

from .identifiers import new_id
from .time import now


@dataclass(frozen=True, slots=True)
class Relationship:
    """
    Immutable relationship between two graph objects.

    Parameters
    ----------
    source_id
        Identifier of the source object.
    target_id
        Identifier of the target object.
    relationship_type
        Semantic meaning of the relationship.
    weight
        Relationship strength.
    confidence
        Confidence in the relationship.
    valid_from
        Time from which the relationship is valid.
    valid_to
        Optional time until which the relationship is valid.
    metadata
        Optional additional information.
    """

    source_id: UUID
    target_id: UUID
    relationship_type: str

    weight: float = 1.0
    confidence: float = 1.0

    valid_from: datetime = field(default_factory=now)
    valid_to: datetime | None = None

    metadata: dict[str, Any] = field(default_factory=dict)

    id: UUID = field(default_factory=new_id)

