"""
Canonical observation definition.

Observations are immutable measurements of the Earth.

They represent facts and are the foundation of the Event Store.

Observations never change once recorded.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any
from uuid import UUID

from .identifiers import new_id
from .time import now


@dataclass(frozen=True, slots=True)
class Observation:
    """
    Immutable observation.

    Parameters
    ----------
    entity_id
        Identifier of the observed entity.
    variable
        Name of the observed variable.
    value
        Observed value.
    unit
        Measurement unit.
    observed_at
        Time the observation occurred.
    source
        Origin of the observation.
    quality
        Quality indicator for the observation.
    metadata
        Optional additional information.
    """

    entity_id: UUID
    variable: str
    value: Any
    unit: str
    source: str

    observed_at: datetime = field(default_factory=now)
    quality: float = 1.0
    metadata: dict[str, Any] = field(default_factory=dict)

    id: UUID = field(default_factory=new_id)
