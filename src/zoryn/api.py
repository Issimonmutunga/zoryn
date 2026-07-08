"""
Public API for Zoryn.
"""

from __future__ import annotations

from pathlib import Path

import polars as pl

from .knowledge.engine import KnowledgeEngine
from .knowledge.store import ObservationStore


class Zoryn:
    """
    Public interface to the Zoryn reasoning engine.
    """

    def __init__(
        self,
        observations: str | Path,
    ) -> None:

        observations = Path(
            observations
        )

        if not observations.exists():

            raise FileNotFoundError(
                observations
            )

        store = ObservationStore(
            pl.scan_parquet(
                observations
            )
        )

        self._engine = KnowledgeEngine(
            store
        )

    @property
    def engine(
        self,
    ) -> KnowledgeEngine:
        """
        Return the underlying reasoning engine.
        """

        return self._engine

    def run(
        self,
    ):
        """
        Execute the complete reasoning pipeline.

        Returns
        -------
        list[Discovery]
        """

        return self._engine.run()