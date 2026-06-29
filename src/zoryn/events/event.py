"""
Canonical event model for Zoryn.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass(slots=True)
class Event:
    """
    Canonical representation of an Earth system event.
    """

    id: str
    event_type: str
    timestamp: datetime
    latitude: float
    longitude: float

    severity: float | None = None
    source: str | None = None

    observations: dict[str, Any] = field(default_factory=dict)
    metadata: dict[str, Any] = field(default_factory=dict)