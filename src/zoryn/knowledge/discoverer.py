"""
Knowledge discovery primitives.
"""

from __future__ import annotations

from collections import Counter
from collections.abc import Iterable

from .relationship import Relationship


class KnowledgeDiscoverer:
    """
    Discovers recurring environmental changes from Relationships.

    This is intentionally simple in the first implementation.
    It discovers frequencies only; causality and validation
    are handled by later components.
    """

    def __init__(self) -> None:
        self._counter: Counter[str] = Counter()

    def consume(
        self,
        relationships: Iterable[Relationship],
    ) -> None:
        """
        Consume a stream of Relationships.
        """

        for relationship in relationships:

            for variable in relationship.variables():
                self._counter[variable] += 1

    def frequency(
        self,
        variable: str,
    ) -> int:
        """
        Return how many times a variable changed.
        """

        return self._counter[variable]

    def summary(self) -> dict[str, int]:
        """
        Return discovered frequencies.
        """

        return dict(self._counter)

    def reset(self) -> None:
        """
        Clear all discovered statistics.
        """

        self._counter.clear()