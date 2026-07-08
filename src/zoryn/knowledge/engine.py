"""
Knowledge engine.

Coordinates the complete environmental reasoning pipeline.

Observation
    ↓
Signature
    ↓
Relationship
    ↓
Evidence
    ↓
Pattern
    ↓
Hypothesis
    ↓
Discovery
"""

from __future__ import annotations

from .builder import SignatureBuilder
from .comparator import SignatureComparator
from .discoverer import Discoverer
from .evidence_builder import EvidenceBuilder
from .evidence_store import EvidenceStore
from .hypothesis_engine import HypothesisEngine
from .persistent_dryness_rule import (
    PersistentDrynessRule,
)
from .store import ObservationStore
from zoryn.replay import ReplayEngine


class KnowledgeEngine:
    """
    High-level environmental reasoning engine.
    """

    def __init__(
        self,
        store: ObservationStore,
        comparator: SignatureComparator | None = None,
        evidence_builder: EvidenceBuilder | None = None,
        pattern_rule: PersistentDrynessRule | None = None,
        hypothesis_engine: HypothesisEngine | None = None,
        discoverer: Discoverer | None = None,
    ) -> None:

        builder = SignatureBuilder(
            store
        )

        self._replay = ReplayEngine(
            builder
        )

        self._comparator = (
            comparator
            if comparator is not None
            else SignatureComparator()
        )

        self._evidence_builder = (
            evidence_builder
            if evidence_builder is not None
            else EvidenceBuilder()
        )

        self._pattern_rule = (
            pattern_rule
            if pattern_rule is not None
            else PersistentDrynessRule()
        )

        self._hypothesis_engine = (
            hypothesis_engine
            if hypothesis_engine is not None
            else HypothesisEngine()
        )

        self._discoverer = (
            discoverer
            if discoverer is not None
            else Discoverer()
        )
    @property
    def discoverer(
        self,
    ) -> Discoverer:

        return self._discoverer

    def run(
        self,
    ):
        """
        Execute the complete reasoning pipeline.

        Returns
        -------
        list[Discovery]
        """

        evidence = []

        for _, history in self._replay.histories():

            previous = None

            for current in history:

                if previous is None:

                    previous = current
                    continue

                relationship = (
                    self._comparator.compare(
                        previous,
                        current,
                    )
                )

                evidence.extend(
                    self._evidence_builder.build(
                        relationship
                    )
                )

                previous = current

        evidence_store = EvidenceStore(
            evidence
        )

        patterns = (
            self._pattern_rule.discover(
                evidence_store
            )
        )

        hypotheses = (
            self._hypothesis_engine.build(
                patterns
            )
        )

        discoveries = (
            self._discoverer.build(
                hypotheses
            )
        )

        return discoveries