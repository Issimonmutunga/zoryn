"""
Runtime representation of a relationship between two Signatures.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping

from .comparison import ComparisonResult
from .signature import Signature


@dataclass(frozen=True, slots=True)
class Relationship:
    """
    Represents the transition between two Signatures.
    """

    previous: Signature
    current: Signature
    changes: Mapping[str, ComparisonResult]

    def has_change(self, variable: str) -> bool:
        """
        Return True if the variable changed.
        """
        return variable in self.changes

    def change(
        self,
        variable: str,
        default: ComparisonResult | None = None,
    ) -> ComparisonResult | None:
        """
        Return the comparison result for a variable.
        """
        return self.changes.get(variable, default)

    def variables(self):
        """
        Return variables that changed.
        """
        return self.changes.keys()

    def results(self):
        """
        Return comparison results.
        """
        return self.changes.values()

    def items(self):
        """
        Return (variable, ComparisonResult) pairs.
        """
        return self.changes.items()

    def __len__(self) -> int:
        return len(self.changes)

    def __contains__(self, variable: str) -> bool:
        return variable in self.changes

    def __iter__(self):
        return iter(self.changes.items())