"""
Comparison strategy interface.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True, slots=True)
class ComparisonResult:
    """
    Result of comparing two observations.
    """

    changed: bool
    value: Any
    metadata: dict[str, Any]


class ComparisonStrategy(ABC):
    """
    Base class for variable comparison strategies.
    """

    @abstractmethod
    def compare(
        self,
        previous: Any,
        current: Any,
    ) -> ComparisonResult:
        """
        Compare two values.
        """
        raise NotImplementedError