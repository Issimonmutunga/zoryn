"""
Utilities for comparing two Signatures.
"""

from __future__ import annotations

from .relationship import Relationship
from .signature import Signature


class SignatureComparator:
    """
    Compares two Signatures and produces a Relationship.
    """

    @staticmethod
    def compare(
        previous: Signature,
        current: Signature,
    ) -> Relationship:
        """
        Compare two Signatures.

        Returns
        -------
        Relationship
            Runtime relationship describing the transition.
        """

        if previous.h3_id != current.h3_id:
            raise ValueError(
                "Signatures must belong to the same H3 cell."
            )

        changes: dict[str, float] = {}

        variables = (
            set(previous.keys())
            & set(current.keys())
        )

        for variable in sorted(variables):

            old = previous.get(variable)
            new = current.get(variable)

            if old != new:
                changes[variable] = new - old

        return Relationship(
            previous=previous,
            current=current,
            changes=changes,
        )