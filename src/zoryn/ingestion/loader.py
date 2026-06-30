"""
Observation loader for Zoryn.
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd

from .schema import Observation


def load_observations(path: str | Path) -> list[Observation]:
    """
    Load observations from a CSV file.

    Expected columns:

    timestamp
    node_id
    variable
    value
    source
    """

    df = pd.read_csv(path)

    observations: list[Observation] = []

    for row in df.itertuples(index=False):
        observations.append(
            Observation(
                timestamp=str(row.timestamp),
                node_id=str(row.node_id),
                variable=str(row.variable),
                value=float(row.value),
                source=str(row.source),
            )
        )

    observations.sort(
        key=lambda observation: (
            observation.node_id,
            observation.timestamp,
        )
    )

    return observations