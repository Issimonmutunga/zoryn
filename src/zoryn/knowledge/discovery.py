"""
Knowledge discovery for Zoryn.
"""

from __future__ import annotations

from .relationship import Relationship
from .signature import Signature


class KnowledgeDiscovery:
    """
    Baseline knowledge discovery.

    Discovers transitions between consecutive signatures
    within the same spatial node.
    """

    def discover(
        self,
        signatures: list[Signature],
    ) -> list[Relationship]:
        relationships: list[Relationship] = []

        grouped: dict[str, list[Signature]] = {}

        for signature in signatures:
            grouped.setdefault(signature.node_id, []).append(signature)

        for node_signatures in grouped.values():
            node_signatures.sort(key=lambda s: s.timestamp)

            for current, nxt in zip(node_signatures, node_signatures[1:]):
                relationships.append(
                    Relationship(
                        source_signature=self._signature_name(current),
                        target_signature=self._signature_name(nxt),
                        lead_time=1,
                        lead_time_unit="step",
                        conditions={
                            "node_id": current.node_id,
                        },
                    )
                )

        return relationships

    @staticmethod
    def _signature_name(signature: Signature) -> str:
        """
        Produce a deterministic identifier for a signature.

        This is a placeholder until learned signatures
        replace deterministic ones.
        """
        return "|".join(sorted(signature.variables.keys()))