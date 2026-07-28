"""
Discovery generation engine.
"""

from __future__ import annotations

from collections.abc import Iterable

from .discovery import Discovery
from .hypothesis import Hypothesis
from .spi_repository import SPIRepository


class Discoverer:
    """
    Converts hypotheses into environmental discoveries.
    """

    def __init__(
        self,
    ) -> None:

        self._spi = SPIRepository()

    def build(
        self,
        hypotheses: Iterable[
            Hypothesis
        ],
    ) -> list[Discovery]:

        discoveries: list[
            Discovery
        ] = []

        for hypothesis in hypotheses:

            spi = self._spi.lookup(
                hypothesis.metadata[
                    "h3_id"
                ],
                hypothesis.end,
            )

            discoveries.append(
                Discovery(
                    name=hypothesis.name,
                    hypothesis=hypothesis,
                    confidence=hypothesis.confidence,
                    metadata={
                        "h3_id": (
                            hypothesis.metadata[
                                "h3_id"
                            ]
                        ),
                        "source":
                            "Zoryn",
                        "version":
                            "0.1.0",
                        "spi3":
                            spi["spi3"],
                        "spi6":
                            spi["spi6"],
                        "spi12":
                            spi["spi12"],
                    },
                )
            )

        return sorted(
            discoveries,
            key=lambda discovery: (
                discovery.h3_id,
                discovery.name,
            ),
        )