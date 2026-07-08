"""
API dependency providers.

Centralizes construction of shared application
components for the REST API.
"""

from __future__ import annotations

from pathlib import Path

import polars as pl

from zoryn.knowledge import (
    KnowledgeEngine,
    ObservationStore,
)


_OBSERVATIONS = (
    Path(
        "data/processed/observations/"
        "master_observations.parquet"
    )
)


def get_store() -> ObservationStore:
    """
    Return the observation store.
    """

    observations = pl.scan_parquet(
        _OBSERVATIONS
    )

    return ObservationStore(
        observations
    )


def get_engine() -> KnowledgeEngine:
    """
    Return the knowledge engine.
    """

    return KnowledgeEngine(
        get_store()
    )
