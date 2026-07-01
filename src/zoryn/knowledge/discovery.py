"""
Immutable representation of a discovered environmental pattern.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping


@dataclass(frozen=True, slots=True)
class Discovery:
    """
    A discovered environmental pattern.

    Parameters
    ----------
    name
        Canonical discovery name.

    evidence
        Supporting evidence.

    confidence
        Confidence score in [0, 1].

    metadata
        Additional information describing the discovery.
    """

    name: str
    evidence: int
    confidence: float
    metadata: Mapping[str, object]

    def is_confident(
        self,
        threshold: float = 0.8,
    ) -> bool:
        """
        Return True if the confidence exceeds the threshold.
        """
        return self.confidence >= threshold