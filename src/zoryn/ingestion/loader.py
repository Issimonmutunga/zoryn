"""
Observation loader for Zoryn.
"""

from __future__ import annotations

from pathlib import Path

import polars as pl

from .schema import Observation


REQUIRED_COLUMNS = (
    "timestamp",
    "h3_id",
    "variable",
    "value",
    "source",
)


def load_observations(
    path: str | Path,
) -> list[Observation]:
    """
    Load canonical observations.
    """

    df = pl.read_csv(path)

    missing = (
        set(REQUIRED_COLUMNS)
        - set(df.columns)
    )

    if missing:
        raise ValueError(
            f"Missing columns: {sorted(missing)}"
        )

    observations = [
        Observation(
            timestamp=row["timestamp"],
            h3_id=row["h3_id"],
            variable=row["variable"],
            value=float(row["value"]),
            source=row["source"],
        )
        for row in df.iter_rows(named=True)
    ]

    observations.sort(
        key=lambda observation: (
            observation.h3_id,
            observation.timestamp,
        )
    )

    return observations