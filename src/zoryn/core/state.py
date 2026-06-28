"""
Canonical state definition.

A state represents the condition of an entity at a specific point in time.

States are immutable.

New observations produce new states rather than modifying existing ones.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any
from uuid import UUID

from .identifiers import new_id
from .time import now


@dataclass(frozen=True, slots=True)
class State:
    """
    Immutable entity state.

    Parameters
    ----------
    entity_id
        Identifier of the entity.
    attributes
        Derived attributes describing the entity.
    observed_at
        Timestamp represented by this state.
    confidence
        Confidence in the derived state.
    metadata
        Optional additional information.
    """

    entity_id: UUID
    attributes: dict[str, Any]

    observed_at: datetime = field(default_factory=now)
    confidence: float = 1.0
    metadata: dict[str, Any] = field(default_factory=dict)

    id: UUID = field(default_factory=new_id)
