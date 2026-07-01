"""
Knowledge discovery primitives.
"""

from __future__ import annotations

from collections import Counter
from collections.abc import Iterable

from .evidence import Evidence


class KnowledgeDiscoverer:
    """
    Discovers recurring evidence.

    This first implementation accumulates evidence frequencies.
    Future versions will discover hypotheses rather than counts.
    """

    def __init__(self) -> None:

        self._counter: Counter[str] = Counter()

    def consume(
        self,
        evidence: Iterable[Evidence],
    ) -> None:
        """
        Consume a stream of Evidence.
        """

        for item in evidence:

            self._counter[item.variable] += 1

    def frequency(
        self,
        variable: str,
    ) -> int:
        """
        Return accumulated evidence count.
        """

        return self._counter[variable]

    def summary(self) -> dict[str, int]:
        """
        Return discovery summary.
        """

        return dict(self._counter)

    def reset(self) -> None:
        """
        Reset accumulated discoveries.
        """

        self._counter.clear()