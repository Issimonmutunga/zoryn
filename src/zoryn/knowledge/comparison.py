"""
Comparison strategy interface.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class Direction(Enum):
    """
    Direction of change between two observations.
    """

    NONE = "none"
    INCREASE = "increase"
    DECREASE = "decrease"


@dataclass(frozen=True, slots=True)
class ComparisonResult:
    """
    Result of comparing two observations.
    """

    changed: bool
    value: Any
    direction: Direction = Direction.NONE
    metadata: dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        # Guard against silently inconsistent results: a "changed" comparison
        # with no direction is ambiguous for any rule that cares about
        # increase/decrease sequences (e.g. ConsecutiveChangeRule).
        if self.changed and self.direction is Direction.NONE:
            raise ValueError(
                "ComparisonResult has changed=True but direction=Direction.NONE; "
                "concrete ComparisonStrategy implementations must set an explicit "
                "direction (INCREASE/DECREASE) whenever changed=True."
            )


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