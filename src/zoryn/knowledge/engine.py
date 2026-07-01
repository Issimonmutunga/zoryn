"""
Knowledge engine.

Coordinates replay, comparison and discovery.
"""

from __future__ import annotations

from .builder import SignatureBuilder
from .comparator import SignatureComparator
from .discoverer import KnowledgeDiscoverer
from zoryn.replay import ReplayEngine


class KnowledgeEngine:
    """
    High-level knowledge discovery engine.
    """

    def __init__(
        self,
        builder: SignatureBuilder,
    ) -> None:

        self._builder = builder
        self._replay = ReplayEngine(builder)
        self._discoverer = KnowledgeDiscoverer()

    @property
    def discoverer(self) -> KnowledgeDiscoverer:
        return self._discoverer

    def run(self) -> None:
        """
        Execute one replay over all signatures.
        """

        previous = None

        for current in self._replay:

            if (
                previous is not None
                and previous.h3_id == current.h3_id
            ):

                relationship = (
                    SignatureComparator.compare(
                        previous,
                        current,
                    )
                )

                self._discoverer.consume(
                    [relationship]
                )

            previous = current