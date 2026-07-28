"""
API dependency providers.

Centralizes access to the persisted knowledge dataset.
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

import polars as pl


_PROJECT_ROOT = (
    Path(__file__)
    .resolve()
    .parents[3]
)

_KNOWLEDGE = (
    _PROJECT_ROOT
    / "data"
    / "processed"
    / "knowledge"
)


def _load(
    table: str,
) -> pl.DataFrame:
    """
    Load a partitioned knowledge table.
    """

    directory = _KNOWLEDGE / table

    files = sorted(
        directory.glob(
            "*.parquet"
        )
    )

    if not files:

        raise FileNotFoundError(
            f"No parquet files found for {table}."
        )

    return pl.concat(
        [
            pl.read_parquet(
                file
            )
            for file in files
        ]
    )


@lru_cache(maxsize=1)
def get_knowledge() -> dict[str, pl.DataFrame]:
    """
    Return the persisted knowledge dataset.

    The dataset is loaded once and reused by
    all API requests.
    """

    return {
        "discoveries": _load(
            "discoveries"
        ),
        "hypotheses": _load(
            "hypotheses"
        ),
        "patterns": _load(
            "patterns"
        ),
        "evidence": _load(
            "evidence"
        ),
        "hypothesis_patterns": _load(
            "hypothesis_patterns"
        ),
        "pattern_evidence": _load(
            "pattern_evidence"
        ),
    }