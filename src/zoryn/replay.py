"""
Historical replay engine for Zoryn.
"""

from __future__ import annotations

from zoryn.ingestion.schema import Observation
from zoryn.knowledge.builder import SignatureBuilder
from zoryn.knowledge.discovery import KnowledgeDiscovery


class ReplayEngine:
    """
    Replays historical observations chronologically.
    """

    def __init__(self) -> None:
        self.builder = SignatureBuilder()
        self.discovery = KnowledgeDiscovery()

    def run(
        self,
        observations: list[Observation],
    ):
        """
        Execute one replay over historical observations.
        """

        signatures = self.builder.build(observations)

        relationships = self.discovery.discover(signatures)

        return relationships