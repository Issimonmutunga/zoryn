"""
Canonical entity definition.

Entities represent persistent real-world objects.

Entities are immutable.

Only their states evolve over time.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any
from uuid import UUID

from .identifiers import new_id


@dataclass(frozen=True, slots=True)
class Entity:
    """
    Base class for all graph entities.

    Parameters
    ----------
    id
        Globally unique immutable identifier.
    entity_type
        Logical type of the entity.
    metadata
        Optional descriptive metadata.
    """

    entity_type: str
    metadata: dict[str, Any] = field(default_factory=dict)
    id: UUID = field(default_factory=new_id)