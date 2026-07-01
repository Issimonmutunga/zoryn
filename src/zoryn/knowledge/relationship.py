"""
Runtime representation of a relationship between two Signatures.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping

from .signature import Signature


@dataclass(frozen=True, slots=True)
class Relationship:
    """
    Represents the transition between two Signatures.
    """

    previous: Signature
    current: Signature
    changes: Mapping[str, float]

    def has_change(self, variable: str) -> bool:
        """Return True if a variable changed."""
        return variable in self.changes

    def change(self, variable: str, default: float | None = None):
        """Return the computed change for a variable."""
        return self.changes.get(variable, default)

    def variables(self):
        """Return variables that changed."""
        return self.changes.keys()

    def __len__(self) -> int:
        return len(self.changes)

    def __contains__(self, variable: str) -> bool:
        return variable in self.changes