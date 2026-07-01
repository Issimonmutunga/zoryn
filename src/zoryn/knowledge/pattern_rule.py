"""
Pattern rule interface.

Defines how recurring environmental patterns are identified.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Iterable

from .evidence import Evidence
from .pattern import Pattern


class PatternRule(ABC):
    """
    Base class for pattern extraction rules.
    """

    @abstractmethod
    def discover(
        self,
        evidence: Iterable[Evidence],
    ) -> list[Pattern]:
        """
        Discover patterns from evidence.
        """
        raise NotImplementedError