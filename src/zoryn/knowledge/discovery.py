"""
Immutable environmental discovery.

A Discovery represents the final interpreted
environmental conclusion produced by Zoryn.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping

from .hypothesis import Hypothesis


@dataclass(
    frozen=True,
    slots=True,
)
class Discovery:
    """
    Final environmental discovery.
    """

    name: str

    hypothesis: Hypothesis

    confidence: float

    metadata: Mapping[
        str,
        object,
    ]

    @property
    def h3_id(
        self,
    ) -> str:

        return self.metadata[
            "h3_id"
        ]

    @property
    def start(
        self,
    ) -> str:

        return self.hypothesis.start

    @property
    def end(
        self,
    ) -> str:

        return self.hypothesis.end

    @property
    def variables(
        self,
    ) -> tuple[str, ...]:

        return self.hypothesis.variables

    @property
    def patterns(
        self,
    ):

        return self.hypothesis.patterns
    
    @property
    def evidence(
        self,
    ):
        """
        All supporting evidence.
        """

        evidence = []

        for pattern in self.patterns:

            evidence.extend(
                pattern.evidence
            )

        return tuple(
            evidence
        )

    def supports(
        self,
        variable: str,
    ) -> bool:
        """
        Return True if the discovery is
        supported by the given variable.
        """

        return (
            self.hypothesis.supports(
                variable
            )
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