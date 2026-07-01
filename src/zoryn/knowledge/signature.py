"""
Immutable runtime representation of an environmental signature.

A Signature represents the complete environmental state for one
H3 cell at one timestamp.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterator, Mapping


@dataclass(frozen=True, slots=True)
class Signature:
    """
    Immutable environmental state.

    Parameters
    ----------
    timestamp
        Timestamp represented by this signature.

    h3_id
        H3 cell identifier.

    variables
        Mapping from canonical variable name to value.
    """

    timestamp: str
    h3_id: str
    variables: Mapping[str, float]

    def get(self, variable: str, default: float | None = None):
        """Return the value of a variable."""
        return self.variables.get(variable, default)

    def has(self, variable: str) -> bool:
        """Return True if the variable exists."""
        return variable in self.variables

    def keys(self):
        """Return variable names."""
        return self.variables.keys()

    def values(self):
        """Return variable values."""
        return self.variables.values()

    def items(self):
        """Return variable-value pairs."""
        return self.variables.items()

    def __contains__(self, variable: str) -> bool:
        return variable in self.variables

    def __len__(self) -> int:
        return len(self.variables)

    def __iter__(self) -> Iterator[tuple[str, float]]:
        return iter(self.variables.items())