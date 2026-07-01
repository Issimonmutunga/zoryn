"""
Default runtime configuration for knowledge discovery.
"""

from __future__ import annotations

from .registry import StrategyRegistry


def create_strategy_registry() -> StrategyRegistry:
    """
    Create the default comparison strategy registry.

    Future strategy registrations belong here.
    """

    registry = StrategyRegistry()

    #
    # Future registrations
    #
    # registry.register(
    #     "land_cover",
    #     CategoricalComparisonStrategy(),
    # )
    #
    # registry.register(
    #     "wind_direction",
    #     CircularComparisonStrategy(),
    # )
    #

    return registry