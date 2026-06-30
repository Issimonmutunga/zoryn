"""
Signature comparison for Zoryn.
"""

from __future__ import annotations

from .signature import Signature


class SignatureComparator:
    """
    Compares two signatures.

    The initial implementation measures overlap in observed
    canonical variables. Future implementations will compare
    values, temporal trends and learned patterns.
    """

    def similarity(
        self,
        first: Signature,
        second: Signature,
    ) -> float:
        first_keys = set(first.variables)
        second_keys = set(second.variables)

        if not first_keys and not second_keys:
            return 1.0

        union = first_keys | second_keys

        if not union:
            return 0.0

        intersection = first_keys & second_keys

        return len(intersection) / len(union)