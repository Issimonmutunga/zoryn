"""
Immutable representation of evidence supporting a hypothesis.
"""

from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
from typing import Mapping

from .relationship import Relationship


@dataclass(frozen=True, slots=True)
class Evidence:
    """
    One piece of evidence extracted from a Relationship.

    Parameters
    ----------
    relationship
        The relationship from which this evidence was derived.

    variable
        Canonical variable name.

    strength
        Normalized evidence strength.

    metadata
        Additional evidence metadata.
    """

    relationship: Relationship
    variable: str
    strength: float
    metadata: Mapping[str, object]

    @property
    def id(self) -> str:
        """
        Stable identifier for this evidence.
        """

        value = "|".join(
            (
                self.h3_id,
                self.timestamp,
                self.variable,
            )
        )

        return sha256(
            value.encode("utf-8")
        ).hexdigest()

    @property
    def h3_id(self) -> str:
        """
        H3 cell where the evidence originated.
        """
        return self.relationship.current.h3_id

    @property
    def timestamp(self) -> str:
        """
        Timestamp of the evidence.
        """
        return self.relationship.current.timestamp

    @property
    def comparison(self):
        """
        Return the underlying comparison result.
        """
        return self.relationship.change(self.variable)

    def is_strong(
        self,
        threshold: float = 0.8,
    ) -> bool:
        """
        Return True if the evidence exceeds the threshold.
        """
        return self.strength >= threshold