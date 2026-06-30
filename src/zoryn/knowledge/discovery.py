"""
Knowledge discovery for Zoryn.
"""

from __future__ import annotations

from .relationship import Relationship
from .unit import KnowledgeUnit


class KnowledgeDiscovery:
    """
    Discovers candidate knowledge from observations.
    """

    def discover(self, relationship: Relationship) -> KnowledgeUnit:
        """
        Convert a discovered relationship into a candidate
        knowledge unit.

        The relationship discovery algorithm will be implemented
        in later iterations.
        """
        return KnowledgeUnit(
            relationship=relationship,
        )