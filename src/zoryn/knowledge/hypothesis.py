"""
Immutable hazard hypothesis.

A hypothesis represents an interpretable environmental
explanation supported by one or more patterns.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping

from .pattern import Pattern


@dataclass(
    frozen=True,
    slots=True,
)
class Hypothesis:
    """
    Environmental hypothesis.

    Examples

    - Developing Meteorological Drought
    - Developing Heatwave
    - Developing Flood
    """

    name: str

    patterns: tuple[
        Pattern,
        ...
    ]

    confidence: float

    metadata: Mapping[
        str,
        object,
    ]

    @property
    def frequency(
        self,
    ) -> int:
        """
        Total supporting frequency.
        """

        return sum(
            pattern.frequency
            for pattern in self.patterns
        )

    @property
    def variables(
        self,
    ) -> tuple[str, ...]:

        variables = set()

        for pattern in self.patterns:

            variables.update(
                pattern.variables
            )

        return tuple(
            sorted(
                variables
            )
        )

    def supports(
        self,
        variable: str,
    ) -> bool:

        return variable in self.variables
    @property
    def h3_ids(
        self,
    ) -> tuple[str, ...]:
        """
        H3 cells supporting this hypothesis.
        """

        return tuple(
            sorted(
                {
                    pattern.metadata["h3_id"]
                    for pattern in self.patterns
                }
            )
        )

    @property
    def start(
        self,
    ) -> str:
        """
        Earliest supporting timestamp.
        """

        return min(
            pattern.metadata["start"]
            for pattern in self.patterns
        )

    @property
    def end(
        self,
    ) -> str:
        """
        Latest supporting timestamp.
        """

        return max(
            pattern.metadata["end"]
            for pattern in self.patterns
        )

    def __len__(
        self,
    ) -> int:
        """
        Number of supporting patterns.
        """

        return len(
            self.patterns
        )

    def __iter__(
        self,
    ):
        """
        Iterate over supporting patterns.
        """

        yield from self.patterns