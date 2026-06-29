"""
Application container for Zoryn.
"""

from __future__ import annotations

from zoryn.events import EventStore
from zoryn.hypotheses import HypothesisEngine
from zoryn.warnings import WarningEngine


class Zoryn:
    """
    Core Zoryn application.
    """

    def __init__(self) -> None:
        self.events = EventStore()
        self.warnings = WarningEngine()
        self.hypotheses = HypothesisEngine()