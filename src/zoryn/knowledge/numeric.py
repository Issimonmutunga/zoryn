"""
Numeric comparison strategy.
"""

from __future__ import annotations

from .comparison import (
    ComparisonResult,
    ComparisonStrategy,
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

        if previous == 0:
            percent_change = None
        else:
            percent_change = (
                delta / previous
            ) * 100.0

        return ComparisonResult(
            changed=(delta != 0.0),
            value=delta,
            metadata={
                "previous": previous,
                "current": current,
                "delta": delta,
                "percent_change": percent_change,
            },
        )