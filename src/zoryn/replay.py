"""
Historical replay engine for Zoryn.
"""

from __future__ import annotations

from zoryn.ingestion.schema import Observation
from zoryn.knowledge.builder import SignatureBuilder
from zoryn.knowledge.discovery import KnowledgeDiscovery
from zoryn.knowledge.engine import KnowledgeEngine


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
        Execute one historical replay.

        Returns the current knowledge units generated
        from the supplied observations.
        """

        signatures = self.builder.build(observations)

        relationships = self.discovery.discover(signatures)

        knowledge = self.knowledge.learn(relationships)

        return knowledge