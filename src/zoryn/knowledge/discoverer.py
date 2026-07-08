"""
Discovery generation engine.
"""

from __future__ import annotations

from collections.abc import Iterable

from .discovery import Discovery
from .hypothesis import Hypothesis


class Discoverer:
    """
    Converts hypotheses into environmental discoveries.
    """

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