"""
Immutable representation of a scientific hypothesis.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping

from .evidence import Evidence


@dataclass(frozen=True, slots=True)
class Hypothesis:
    """
    Candidate explanation derived from accumulated evidence.
    """

    name: str

    statement: str

    evidence: tuple[Evidence, ...]

    confidence: float

    metadata: Mapping[str, object]

    @property
    def support(self) -> int:
        """
        Number of supporting evidence items.
        """
        return len(self.evidence)

    def is_supported(
        self,
        minimum: int = 10,
    ) -> bool:
        """
        Return True if sufficient evidence exists.
        """
        return self.support >= minimum

    def is_confident(
        self,
        threshold: float = 0.8,
    ) -> bool:
        """
        Return True if confidence exceeds the threshold.
        """
        return self.confidence >= threshold