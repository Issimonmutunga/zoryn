"""
Knowledge engine.

Coordinates replay, comparison, evidence construction
and knowledge discovery.
"""

from __future__ import annotations

from .builder import SignatureBuilder
from .comparator import SignatureComparator
from .discoverer import KnowledgeDiscoverer
from .evidence_builder import EvidenceBuilder
from .store import ObservationStore
from zoryn.replay import ReplayEngine


class KnowledgeEngine:
    """
    High-level knowledge discovery engine.
    """

    def __init__(
        self,
        store: ObservationStore,
        comparator: SignatureComparator | None = None,
        evidence_builder: EvidenceBuilder | None = None,
        discoverer: KnowledgeDiscoverer | None = None,
    ) -> None:

        builder = SignatureBuilder(store)

        self._replay = ReplayEngine(builder)

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

        self._discoverer = (
            discoverer
            if discoverer is not None
            else KnowledgeDiscoverer()
        )

    @property
    def discoverer(self) -> KnowledgeDiscoverer:
        return self._discoverer

    def run(self) -> None:
        """
        Replay every H3 history independently.
        """

        for _, history in self._replay.histories():

            previous = None

            for current in history:

                if previous is not None:

                    relationship = (
                        self._comparator.compare(
                            previous,
                            current,
                        )
                    )

                    evidence = (
                        self._evidence_builder.build(
                            relationship
                        )
                    )

                    self._discoverer.consume(
                        evidence
                    )

                previous = current