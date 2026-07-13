"""
Persistence schema.

Defines the in-memory persistence model produced by the
KnowledgeWriter before serialization.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from .records import (
    DiscoveryRecord,
    EvidenceRecord,
    HypothesisPatternRecord,
    HypothesisRecord,
    PatternEvidenceRecord,
    PatternRecord,
)


@dataclass(
    slots=True,
)
class KnowledgeBundle:
    """
    Collection of persistence records.
    """

    discoveries: list[
        DiscoveryRecord
    ] = field(
        default_factory=list
    )

    hypotheses: list[
        HypothesisRecord
    ] = field(
        default_factory=list
    )

    hypothesis_patterns: list[
        HypothesisPatternRecord
    ] = field(
        default_factory=list
    )

    patterns: list[
        PatternRecord
    ] = field(
        default_factory=list
    )

    pattern_evidence: list[
        PatternEvidenceRecord
    ] = field(
        default_factory=list
    )

    evidence: list[
        EvidenceRecord
    ] = field(
        default_factory=list
    )

    def extend(
        self,
        other: "KnowledgeBundle",
    ) -> None:
        """
        Merge another bundle into this one.
        """

        self.discoveries.extend(
            other.discoveries
        )

        self.hypotheses.extend(
            other.hypotheses
        )

        self.hypothesis_patterns.extend(
            other.hypothesis_patterns
        )

        self.patterns.extend(
            other.patterns
        )

        self.pattern_evidence.extend(
            other.pattern_evidence
        )

        self.evidence.extend(
            other.evidence
        )

    def clear(
        self,
    ) -> None:
        """
        Remove all records.
        """

        self.discoveries.clear()
        self.hypotheses.clear()
        self.hypothesis_patterns.clear()
        self.patterns.clear()
        self.pattern_evidence.clear()
        self.evidence.clear()