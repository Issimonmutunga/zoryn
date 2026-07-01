"""
Comparison strategy registry.
"""

from __future__ import annotations

from collections.abc import Mapping

from .comparison import ComparisonStrategy
from .numeric import NumericComparisonStrategy


class StrategyRegistry:
    """
    Resolves the comparison strategy for a variable.
    """

    def __init__(self) -> None:

        self._strategies: dict[
            str,
            ComparisonStrategy,
        ] = {}

        self._default = NumericComparisonStrategy()

    def register(
        self,
        variable: str,
        strategy: ComparisonStrategy,
    ) -> None:
        """
        Register a strategy for a canonical variable.
        """

        self._strategies[variable] = strategy

    def resolve(
        self,
        variable: str,
    ) -> ComparisonStrategy:
        """
        Resolve the strategy for a variable.
        """

        return self._strategies.get(
            variable,
            self._default,
        )

    @property
    def strategies(
        self,
    ) -> Mapping[str, ComparisonStrategy]:
        """
        Registered strategies.
        """

        return self._strategies