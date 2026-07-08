"""
Persistent dryness pattern rule.

Implements the first scientifically grounded pattern rule
based on the WMO SPI framework.
"""

from __future__ import annotations

from collections.abc import Iterable

from .evidence import Evidence
from .pattern import Pattern
from .pattern_rule import PatternRule


class PersistentDrynessRule(
    PatternRule,
):
    """
    Discover persistent dryness patterns.

    Assumptions
    ----------
    The supplied evidence belongs to a single H3 history,
    is already ordered chronologically, and represents one
    environmental variable.

    Criteria
    --------
    - decreasing environmental signal
    - minimum persistence
    """

    def __init__(
        self,
        minimum_length: int = 3,
    ) -> None:

        if minimum_length < 2:
            raise ValueError(
                "minimum_length must be >= 2."
            )

        self._minimum_length = minimum_length

    def discover(
        self,
        evidence: Iterable[Evidence],
    ) -> list[Pattern]:

        patterns: list[Pattern] = []
        run: list[Evidence] = []

        for item in evidence:

            if (
                item.comparison.direction.value
                == "decrease"
            ):
                run.append(item)

            else:
                self._flush(
                    run,
                    patterns,
                )
                run = []

        self._flush(
            run,
            patterns,
        )

        return patterns

    def _flush(
        self,
        run: list[Evidence],
        patterns: list[Pattern],
    ) -> None:

        if len(run) < self._minimum_length:
            return

        first = run[0]
        last = run[-1]

        patterns.append(
            Pattern(
                name="persistent_dryness",
                evidence=tuple(run),
                frequency=len(run),
                confidence=1.0,
                metadata={
                    "h3_id": first.h3_id,
                    "variable": first.variable,
                    "start": first.timestamp,
                    "end": last.timestamp,
                    "length": len(run),
                    "standard": "WMO SPI",
                },
            )
        )