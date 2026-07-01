"""
Frequency-based pattern discovery.
"""

from __future__ import annotations

from collections import defaultdict
from collections.abc import Iterable

from .evidence import Evidence
from .pattern import Pattern
from .pattern_rule import PatternRule


class FrequencyRule(PatternRule):
    """
    Discovers recurring patterns based on evidence frequency.
    """

    def __init__(
        self,
        minimum_support: int = 10,
    ) -> None:

        self._minimum_support = minimum_support

    def discover(
        self,
        evidence: Iterable[Evidence],
    ) -> list[Pattern]:

        grouped: dict[
            str,
            list[Evidence],
        ] = defaultdict(list)

        for item in evidence:
            grouped[item.variable].append(item)

        patterns: list[Pattern] = []

        for variable, items in grouped.items():

            frequency = len(items)

            if frequency < self._minimum_support:
                continue

            confidence = min(
                1.0,
                frequency / (2 * self._minimum_support),
            )

            patterns.append(
                Pattern(
                    name=f"{variable}_frequency",
                    evidence=tuple(items),
                    frequency=frequency,
                    confidence=confidence,
                    metadata={
                        "rule": "frequency",
                    },
                )
            )

        return patterns