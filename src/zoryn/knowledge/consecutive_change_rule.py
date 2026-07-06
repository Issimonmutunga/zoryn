"""
Generic consecutive change pattern discovery rule.
"""

from __future__ import annotations

from collections import defaultdict
from collections.abc import Iterable

from .evidence import Evidence
from .pattern import Pattern
from .pattern_rule import PatternRule


class ConsecutiveChangeRule(PatternRule):
    """
    Discovers consecutive runs of identical change direction.

    Example

        increase
        increase
        increase

    →

        persistent_increase

    and

        decrease
        decrease

    →

        persistent_decrease
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

    @property
    def minimum_length(
        self,
    ) -> int:

        return self._minimum_length

    def discover(
        self,
        evidence: Iterable[Evidence],
    ) -> list[Pattern]:
        """
        Discover consecutive patterns.
        """

        grouped: dict[
            tuple[str, str],
            list[Evidence],
        ] = defaultdict(list)

        # --------------------------------------------------
        # Group by H3 and variable
        # --------------------------------------------------

        for item in evidence:

            grouped[
                (
                    item.h3_id,
                    item.variable,
                )
            ].append(item)

        patterns: list[Pattern] = []

        # --------------------------------------------------
        # Process each history independently
        # --------------------------------------------------

        for (
            h3_id,
            variable,
        ), history in grouped.items():

            history.sort(
                key=lambda e: e.timestamp,
            )

            run: list[Evidence] = []

            previous_direction = None
                        # ----------------------------------------------
            # Walk chronological evidence
            # ----------------------------------------------

            for item in history:

                direction = (
                    item.comparison.direction
                )

                if previous_direction is None:

                    run.append(item)
                    previous_direction = direction
                    continue

                if direction == previous_direction:

                    run.append(item)
                    continue

                # ------------------------------------------
                # Direction changed
                # ------------------------------------------

                if (
                    len(run)
                    >= self._minimum_length
                ):

                    patterns.append(
                        Pattern(
                            name=(
                                f"persistent_{previous_direction}"
                            ),
                            evidence=tuple(run),
                            metadata={
                                "h3_id": h3_id,
                                "variable": variable,
                                "direction": (
                                    previous_direction
                                ),
                                "length": len(run),
                                "start": (
                                    run[0].timestamp
                                ),
                                "end": (
                                    run[-1].timestamp
                                ),
                            },
                        )
                    )

                run = [item]
                previous_direction = direction

            # ----------------------------------------------
            # Flush final run
            # ----------------------------------------------

            if (
                len(run)
                >= self._minimum_length
            ):

                patterns.append(
                    Pattern(
                        name=(
                            f"persistent_{previous_direction}"
                        ),
                        evidence=tuple(run),
                        metadata={
                            "h3_id": h3_id,
                            "variable": variable,
                            "direction": (
                                previous_direction
                            ),
                            "length": len(run),
                            "start": (
                                run[0].timestamp
                            ),
                            "end": (
                                run[-1].timestamp
                            ),
                        },
                    )
                )

        return sorted(
            patterns,
            key=lambda pattern: (
                pattern.metadata["h3_id"],
                pattern.metadata["variable"],
                pattern.metadata["start"],
            ),
        )