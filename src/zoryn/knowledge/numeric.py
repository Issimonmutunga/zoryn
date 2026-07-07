"""
Numeric comparison strategy.
"""

from __future__ import annotations

from .comparison import (
    ComparisonResult,
    ComparisonStrategy,
    Direction,
)


class NumericComparisonStrategy(
    ComparisonStrategy,
):
    """
    Comparison strategy for continuous variables.
    """

    def compare(
        self,
        previous: float,
        current: float,
    ) -> ComparisonResult:

        delta = current - previous

        if delta > 0.0:

            direction = Direction.INCREASE

        elif delta < 0.0:

            direction = Direction.DECREASE

        else:

            direction = Direction.NONE

        if previous == 0.0:

            percent_change = None

        else:

            percent_change = (
                delta / previous
            ) * 100.0

        return ComparisonResult(
            changed=(delta != 0.0),
            value=delta,
            direction=direction,
            metadata={
                "previous": previous,
                "current": current,
                "delta": delta,
                "percent_change": percent_change,
            },
        )