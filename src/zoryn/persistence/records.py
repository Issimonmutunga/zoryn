"""
Immutable persistence records for the Zoryn knowledge graph.

These records define the persisted representation of the
reasoning graph. They are intentionally independent of the
knowledge engine domain objects.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(
    frozen=True,
    slots=True,
)
class EvidenceRecord:
    """
    Persisted evidence.
    """

    id: str
    h3_id: str
    timestamp: str
    variable: str
    direction: str
    strength: float


@dataclass(
    frozen=True,
    slots=True,
)
class PatternRecord:
    """
    Persisted environmental pattern.
    """

    id: str
    name: str
    confidence: float
    frequency: int
    standard: str


@dataclass(
    frozen=True,
    slots=True,
)
class PatternEvidenceRecord:
    """
    Relationship between a pattern and its supporting evidence.
    """

    pattern_id: str
    evidence_id: str


@dataclass(
    frozen=True,
    slots=True,
)
class HypothesisRecord:
    """
    Persisted environmental hypothesis.
    """

    id: str
    name: str
    confidence: float


@dataclass(
    frozen=True,
    slots=True,
)
class HypothesisPatternRecord:
    """
    Relationship between a hypothesis and its supporting patterns.
    """

    hypothesis_id: str
    pattern_id: str


@dataclass(
    frozen=True,
    slots=True,
)
class DiscoveryRecord:
    """
    Persisted environmental discovery.
    """

    id: str
    hypothesis_id: str
    h3_id: str
    name: str
    confidence: float
    start: str
    end: str
    timestamp: str
    spi3: float | None
    spi6: float | None
    spi12: float | None