"""
Signature comparison engine.
"""

from __future__ import annotations

from .defaults import create_strategy_registry
from .relationship import Relationship
from .signature import Signature


class SignatureComparator:
    """
    Compares two Signatures using variable-specific strategies.
    """

    def __init__(self):

        self._registry = (
            create_strategy_registry()
        )

    def compare(
        self,
        previous: Signature,
        current: Signature,
    ) -> Relationship:
        """
        Compare two Signatures.
        """

        if previous.h3_id != current.h3_id:
            raise ValueError(
                "Signatures belong to different H3 cells."
            )

        changes = {}

        variables = (
            set(previous.keys())
            & set(current.keys())
        )

        for variable in sorted(variables):

            strategy = self._registry.resolve(
                variable
            )

            result = strategy.compare(
                previous.get(variable),
                current.get(variable),
            )

            if result.changed:

                changes[variable] = result

        return Relationship(
            previous=previous,
            current=current,
            changes=changes,
        )