"""
Hypothesis generation engine.
"""

from __future__ import annotations

from collections import defaultdict
from collections.abc import Iterable

from .hypothesis import Hypothesis
from .pattern import Pattern


class HypothesisEngine:
    """
    Generates environmental hypotheses from
    discovered patterns.
    """

    def build(
        self,
        patterns: Iterable[Pattern],
    ) -> list[Hypothesis]:

        grouped: dict[
            tuple[str, str],
            list[Pattern],
        ] = defaultdict(list)

        for pattern in patterns:

            grouped[
                (
                    pattern.metadata["h3_id"],
                    pattern.name,
                )
            ].append(pattern)

        hypotheses: list[
            Hypothesis
        ] = []

        for (
            h3_id,
            pattern_name,
        ), supporting_patterns in grouped.items():

            hypothesis_name = (
                self._name(
                    pattern_name
                )
            )

            confidence = min(
                1.0,
                sum(
                    p.frequency
                    for p in supporting_patterns
                )
                / 12.0,
            )
            hypotheses.append(
                Hypothesis(
                    name=hypothesis_name,
                    patterns=tuple(
                        supporting_patterns
                    ),
                    confidence=confidence,
                    metadata={
                        "h3_id": h3_id,
                        "pattern": pattern_name,
                        "support": len(
                            supporting_patterns
                        ),
                    },
                )
            )

        return sorted(
            hypotheses,
            key=lambda hypothesis: (
                hypothesis.metadata["h3_id"],
                hypothesis.name,
            ),
        )

    def _name(
        self,
        pattern_name: str,
    ) -> str:
        """
        Map pattern names to environmental hypotheses.
        """

        mapping = {
            "persistent_dryness":
                "Developing Meteorological Drought",
        }

        return mapping.get(
            pattern_name,
            f"Hypothesis: {pattern_name}",
        )