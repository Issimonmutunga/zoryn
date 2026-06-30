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

    All dataset-specific variable names are resolved to the
    canonical Zoryn vocabulary during construction.
    """

    timestamp: str
    node_id: str
    variable: str
    value: float
    source: str

    def __post_init__(self) -> None:
        object.__setattr__(self, "variable", resolve(self.variable))