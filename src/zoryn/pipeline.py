"""
Core processing pipeline for Zoryn.
"""

from __future__ import annotations

from pathlib import Path

from zoryn.events import EventStore
from zoryn.hypotheses import HypothesisEngine
from zoryn.ingestion import load_observations
from zoryn.warnings import WarningEngine


class Pipeline:
    """
    Coordinates the core Zoryn workflow.
    """

    def __init__(self) -> None:
        self.events = EventStore()
        self.warnings = WarningEngine()
        self.hypotheses = HypothesisEngine()

    def ingest(self, path: str | Path):
        """
        Load observations into the pipeline.
        """
        return load_observations(path)