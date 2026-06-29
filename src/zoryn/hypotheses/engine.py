"""
Hypothesis engine for Zoryn.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True)
class Hypothesis:
    """
    Candidate precursor relationship.
    """

    id: str
    name: str
    description: str

    enabled: bool = True
    confidence: float = 0.0

    evidence: list[dict[str, Any]] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)


class HypothesisEngine:
    """
    Stores and manages candidate hypotheses.
    """

    def __init__(self) -> None:
        self._hypotheses: dict[str, Hypothesis] = {}

    def add(self, hypothesis: Hypothesis) -> None:
        self._hypotheses[hypothesis.id] = hypothesis

    def get(self, hypothesis_id: str) -> Hypothesis | None:
        return self._hypotheses.get(hypothesis_id)

    def remove(self, hypothesis_id: str) -> None:
        self._hypotheses.pop(hypothesis_id, None)

    def all(self) -> list[Hypothesis]:
        return list(self._hypotheses.values())

    def clear(self) -> None:
        self._hypotheses.clear()

    def __len__(self) -> int:
        return len(self._hypotheses)