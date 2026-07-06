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
    Discover consecutive runs of identical change direction.

    A run is emitted as a Pattern once its length reaches
    the configured minimum.
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

        # --------------------------------------------
        # Group evidence by H3 and variable
        # --------------------------------------------

        for item in evidence:

            grouped[
                (
                    item.h3_id,
                    item.variable,
                )
            ].append(item)

        patterns: list[Pattern] = []

        # --------------------------------------------
        # Process one history at a time
        # --------------------------------------------

        for (
            h3_id,
            variable,
        ), history in grouped.items():

            history.sort(
                key=lambda e: e.timestamp,
            )

            run: list[Evidence] = []

            current_direction = None

            for item in history:

                direction = (
                    item.comparison.direction
                )

                if current_direction is None:

                    current_direction = direction
                    run.append(item)
                    continue

                if direction == current_direction:

                    run.append(item)
                    continue
                                # ----------------------------------------
                # Direction changed
                # ----------------------------------------

                if (
                    len(run)
                    >= self._minimum_length
                ):

                    patterns.append(
                        Pattern(
                            name=(
                                f"persistent_{current_direction}"
                            ),
                            evidence=tuple(run),
                            frequency=len(run),
                            confidence=1.0,
                            metadata={
                                "h3_id": h3_id,
                                "variable": variable,
                                "direction": (
                                    current_direction
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
                current_direction = direction

            # --------------------------------------------
            # Flush final run
            # --------------------------------------------

            if (
                len(run)
                >= self._minimum_length
            ):

                patterns.append(
                    Pattern(
                        name=(
                            f"persistent_{current_direction}"
                        ),
                        evidence=tuple(run),
                        frequency=len(run),
                        confidence=1.0,
                        metadata={
                            "h3_id": h3_id,
                            "variable": variable,
                            "direction": (
                                current_direction
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