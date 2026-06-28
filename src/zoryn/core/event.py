"""
Canonical event definition.

Events are immutable facts recorded by Zoryn.

The Event Store is the system of record.

The Living Earth Graph is reconstructed by replaying events.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any
from uuid import UUID

from .identifiers import new_id
from .time import now


@dataclass(frozen=True, slots=True)
class Event:
    """
    Immutable event.

    Parameters
    ----------
    event_type
        Logical type of the event.
    entity_id
        Primary entity associated with the event.
    event_time
        Time the event occurred.
    recorded_time
        Time the event was recorded by Zoryn.
    payload
        Event-specific data.
    metadata
        Optional additional information.
    """

    event_type: str
    entity_id: UUID | None
    event_time: datetime

    payload: dict[str, Any] = field(default_factory=dict)
    metadata: dict[str, Any] = field(default_factory=dict)

    recorded_time: datetime = field(default_factory=now)

    id: UUID = field(default_factory=new_id)