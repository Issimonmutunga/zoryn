"""
Historical replay engine for Zoryn.
"""

from __future__ import annotations

from collections import defaultdict

from zoryn.ingestion.schema import Observation
from zoryn.knowledge.builder import SignatureBuilder
from zoryn.knowledge.discovery import KnowledgeDiscovery
from zoryn.knowledge.engine import KnowledgeEngine
from zoryn.validation import ValidationEngine


class ReplayEngine:
    """
    Replays historical observations chronologically.
    """

    def __init__(self) -> None:
        self.builder = SignatureBuilder()
        self.discovery = KnowledgeDiscovery()
        self.knowledge = KnowledgeEngine()
        self.validation = ValidationEngine()

    def run(
        self,
        observations: list[Observation],
    ):
        """
        Execute a chronological replay.
        """

        signatures = self.builder.build(observations)

        grouped: dict[str, list] = defaultdict(list)

        for signature in signatures:
            grouped[signature.node_id].append(signature)

        validated = []

        for node_signatures in grouped.values():
            node_signatures.sort(key=lambda s: s.timestamp)

            for current, future in zip(
                node_signatures,
                node_signatures[1:],
            ):
                relationships = self.discovery.discover(
                    [current, future]
                )

                knowledge = self.knowledge.learn(
                    relationships
                )

                validated.extend(
                    self.validation.validate(
                        knowledge,
                        current,
                        future,
                    )
                )

        return validated