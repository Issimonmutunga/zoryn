"""
Knowledge discovery for Zoryn.
"""

from __future__ import annotations

from .unit import KnowledgeUnit


class KnowledgeDiscovery:
    """
    Discovers candidate knowledge from observations.
    """

    def discover(self, relationship: str) -> KnowledgeUnit:
        """
        Create a candidate knowledge unit.

        The discovery algorithm will replace this placeholder
        in subsequent iterations.
        """
        return KnowledgeUnit(
            relationship=relationship,
        )