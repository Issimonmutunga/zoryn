"""
Rule-based relationship discovery.
"""

from __future__ import annotations

from collections import defaultdict

from .relationship import Relationship
from .signature import Signature


class RuleBasedDiscoverer:
    """
    Baseline relationship discovery.

    Discovers consecutive signature transitions occurring
    within the same spatial node.
    """

    def discover(
        self,
        signatures: list[Signature],
    ) -> list[Relationship]:
        relationships: list[Relationship] = []

        grouped: dict[str, list[Signature]] = defaultdict(list)

        for signature in signatures:
            grouped[signature.node_id].append(signature)

        for node_signatures in grouped.values():
            node_signatures.sort(key=lambda s: s.timestamp)

            for current, nxt in zip(node_signatures, node_signatures[1:]):
                relationships.append(
                    Relationship(
                        source_signature=current.name,
                        target_signature=nxt.name,
                        lead_time=1,
                        lead_time_unit="step",
                        conditions={
                            "node_id": current.node_id,
                        },
                    )
                )

        return relationships