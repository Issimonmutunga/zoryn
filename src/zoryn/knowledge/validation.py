"""
Knowledge validation for Zoryn.
"""

from __future__ import annotations

from dataclasses import replace

from .unit import KnowledgeStatus, KnowledgeUnit


class KnowledgeValidator:
    """
    Updates a knowledge unit using new evidence.
    """

    def confirm(self, unit: KnowledgeUnit) -> KnowledgeUnit:
        """
        Confirm a knowledge unit with one additional piece of evidence.
        """
        confidence = min(1.0, unit.confidence + 0.1)

        return replace(
            unit,
            confidence=confidence,
            evidence_count=unit.evidence_count + 1,
            status=KnowledgeStatus.VALIDATED,
        )

    def contradict(self, unit: KnowledgeUnit) -> KnowledgeUnit:
        """
        Contradict a knowledge unit with one additional piece of evidence.
        """
        confidence = max(0.0, unit.confidence - 0.1)

        status = (
            KnowledgeStatus.RETIRED
            if confidence == 0.0
            else KnowledgeStatus.WEAKENING
        )

        return replace(
            unit,
            confidence=confidence,
            evidence_count=unit.evidence_count + 1,
            status=status,
        )