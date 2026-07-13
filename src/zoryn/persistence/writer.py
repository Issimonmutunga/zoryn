"""
Knowledge graph mapper.

Maps reasoning objects into immutable persistence records.
"""

from __future__ import annotations

from hashlib import sha256

from zoryn.knowledge.discovery import Discovery

from .records import (
    DiscoveryRecord,
    EvidenceRecord,
    HypothesisPatternRecord,
    HypothesisRecord,
    PatternEvidenceRecord,
    PatternRecord,
)


class KnowledgeWriter:
    """
    Convert discoveries into persistence records.
    """

    def write(
        self,
        discovery: Discovery,
    ) -> dict[str, list]:

        evidence_records = []
        pattern_records = []
        pattern_evidence_records = []
        hypothesis_pattern_records = []

        hypothesis = discovery.hypothesis

        hypothesis_id = self._id(
            "hypothesis",
            hypothesis.name,
            discovery.h3_id,
        )

        hypothesis_record = HypothesisRecord(
            id=hypothesis_id,
            name=hypothesis.name,
            confidence=hypothesis.confidence,
        )

        for pattern in hypothesis.patterns:

            pattern_id = self._id(
                "pattern",
                pattern.name,
                discovery.h3_id,
                pattern.metadata["start"],
                pattern.metadata["end"],
            )

            pattern_records.append(
                PatternRecord(
                    id=pattern_id,
                    name=pattern.name,
                    confidence=pattern.confidence,
                    frequency=pattern.frequency,
                    standard=pattern.metadata.get(
                        "standard",
                        "",
                    ),
                )
            )

            hypothesis_pattern_records.append(
                HypothesisPatternRecord(
                    hypothesis_id=hypothesis_id,
                    pattern_id=pattern_id,
                )
            )

            for evidence in pattern.evidence:

                evidence_id = self._id(
                    "evidence",
                    evidence.h3_id,
                    evidence.timestamp,
                    evidence.variable,
                )

                evidence_records.append(
                    EvidenceRecord(
                        id=evidence_id,
                        h3_id=evidence.h3_id,
                        timestamp=evidence.timestamp,
                        variable=evidence.variable,
                        direction=(
                            evidence.comparison.direction.value
                        ),
                        strength=evidence.strength,
                    )
                )

                pattern_evidence_records.append(
                    PatternEvidenceRecord(
                        pattern_id=pattern_id,
                        evidence_id=evidence_id,
                    )
                )

        discovery_record = DiscoveryRecord(
            id=self._id(
                "discovery",
                discovery.name,
                discovery.h3_id,
            ),
            hypothesis_id=hypothesis_id,
            h3_id=discovery.h3_id,
            name=discovery.name,
            confidence=discovery.confidence,
            start=discovery.start,
            end=discovery.end,
        )

        return {
            "discoveries": [
                discovery_record
            ],
            "hypotheses": [
                hypothesis_record
            ],
            "hypothesis_patterns": (
                hypothesis_pattern_records
            ),
            "patterns": pattern_records,
            "pattern_evidence": (
                pattern_evidence_records
            ),
            "evidence": evidence_records,
        }

    @staticmethod
    def _id(
        *parts: object,
    ) -> str:

        text = "|".join(
            str(part)
            for part in parts
        )

        return sha256(
            text.encode("utf-8")
        ).hexdigest()