"""
Relationship definition for Zoryn.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True, frozen=True)
class Relationship:
    """
    A discovered relationship between two signatures.

    Validation, confidence, and lifecycle are handled separately
    by the knowledge unit.
    """

    source_signature: str

    target_signature: str

    lead_time: int

    lead_time_unit: str

    conditions: dict[str, Any] = field(default_factory=dict)