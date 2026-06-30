"""
Observation signature for Zoryn.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(slots=True, frozen=True)
class Signature:
    """
    A normalized spatiotemporal observation pattern.
    """

    node_id: str

    timestamp: str

    name: str

    value: float

    source: str