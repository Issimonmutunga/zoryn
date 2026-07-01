"""
Canonical observation schema.
"""

from __future__ import annotations

from dataclasses import dataclass

from zoryn.vocabulary.resolver import resolve


@dataclass(slots=True, frozen=True)
class Observation:
    """
    Canonical observation used throughout Zoryn.
    """

    timestamp: str
    h3_id: str
    variable: str
    value: float
    source: str

    def __post_init__(self) -> None:
        object.__setattr__(
            self,
            "variable",
            resolve(self.variable),
        )