"""
Read-only store for Evidence.
"""

from __future__ import annotations

from collections.abc import Iterable, Iterator

from .evidence import Evidence


class EvidenceStore:
    """
    Canonical repository for Evidence.
    """

    def __init__(
        self,
        evidence: Iterable[Evidence],
    ) -> None:

        self._evidence = tuple(evidence)

    def __iter__(
        self,
    ) -> Iterator[Evidence]:

        yield from self._evidence

    def __len__(
        self,
    ) -> int:

        return len(self._evidence)

    def by_variable(
        self,
        variable: str,
    ) -> Iterator[Evidence]:

        for evidence in self._evidence:

            if evidence.variable == variable:
                yield evidence