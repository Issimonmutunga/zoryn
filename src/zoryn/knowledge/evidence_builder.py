"""
Builds Evidence objects from Relationships.
"""

from __future__ import annotations

from .evidence import Evidence
from .relationship import Relationship


class EvidenceBuilder:
    """
    Builds Evidence from Relationships.
    """

    def build(
        self,
        relationship: Relationship,
    ) -> list[Evidence]:
        """
        Build one Evidence object for each changed variable.
        """

        evidence = []

        for variable, comparison in relationship.items():

            metadata = dict(comparison.metadata)

            strength = self._strength(comparison)

            evidence.append(
                Evidence(
                    relationship=relationship,
                    variable=variable,
                    strength=strength,
                    metadata=metadata,
                )
            )

        return evidence

    def _strength(
        self,
        comparison,
    ) -> float:
        """
        Compute normalized evidence strength.

        Version 1 simply returns:

            1.0 if a change occurred
            0.0 otherwise

        This will later become variable-specific.
        """

        return 1.0 if comparison.changed else 0.0