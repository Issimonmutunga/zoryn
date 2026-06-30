"""
Signature builder for Zoryn.
"""

from __future__ import annotations

from collections import defaultdict

from zoryn.ingestion.schema import Observation

from .signature import Signature


class SignatureBuilder:
    """
    Builds one signature per (node, timestamp).
    """

    def build(
        self,
        observations: list[Observation],
    ) -> list[Signature]:
        signatures: dict[tuple[str, str], Signature] = {}

        for observation in observations:
            key = (
                observation.node_id,
                observation.timestamp,
            )

            if key not in signatures:
                signatures[key] = Signature(
                    node_id=observation.node_id,
                    timestamp=observation.timestamp,
                )

            signatures[key].add(observation)

        return sorted(
            signatures.values(),
            key=lambda s: (s.node_id, s.timestamp),
        )