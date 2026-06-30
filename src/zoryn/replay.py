"""
Historical replay engine for Zoryn.
"""

from __future__ import annotations

from collections import defaultdict

from zoryn.ingestion.schema import Observation
from zoryn.knowledge.builder import SignatureBuilder
from zoryn.knowledge.discovery import KnowledgeDiscovery
from zoryn.knowledge.engine import KnowledgeEngine
from zoryn.knowledge.signature import Signature


class ReplayEngine:
    """
    Replays historical observations chronologically.
    """

    def __init__(self) -> None:
        self.builder = SignatureBuilder()
        self.discovery = KnowledgeDiscovery()
        self.knowledge = KnowledgeEngine()

    def run(
        self,
        observations: list[Observation],
    ):
        """
        Execute a chronological replay.
        """

        signatures = self.builder.build(observations)

        grouped: dict[str, list[Signature]] = defaultdict(list)

        for signature in signatures:
            grouped[signature.node_id].append(signature)

        for node_signatures in grouped.values():
            node_signatures.sort(key=lambda s: s.timestamp)

            for current, future in zip(
                node_signatures,
                node_signatures[1:],
            ):
                relationships = self.discovery.discover(
                    [current, future]
                )

                units = self.knowledge.learn(
                    relationships
                )

                future_state = "|".join(
                    sorted(future.variables.keys())
                )

                for unit in units:
                    if (
                        unit.relationship.target_signature
                        == future_state
                    ):
                        self.knowledge.confirm(unit)
                    else:
                        self.knowledge.contradict(unit)

        return self.knowledge.all()