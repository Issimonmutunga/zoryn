"""
Immutable representation of a recurring environmental pattern.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping

from .evidence import Evidence


@dataclass(frozen=True, slots=True)
class Pattern:
    """
    A recurring pattern extracted from evidence.
    """

    name: str

    evidence: tuple[Evidence, ...]

    frequency: int

    confidence: float

    metadata: Mapping[str, object]

    @property
    def variables(self) -> tuple[str, ...]:
        """
        Variables represented in the pattern.
        """

        return tuple(
            sorted(
                {
                    e.variable
                    for e in self.evidence
                }
            )
        )

    def supports(
        self,
        variable: str,
    ) -> bool:
        return variable in self.variables