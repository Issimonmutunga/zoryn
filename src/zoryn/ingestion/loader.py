"""
Observation loading utilities for Zoryn.

This module provides the public entry point for reading observation
datasets from disk. Supported formats are CSV and Parquet.

The loader is responsible for:

1. Reading observations.
2. Normalizing them to the canonical schema.
3. Validating them.
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd

from .validators import validate_observations

SUPPORTED_EXTENSIONS = {".csv", ".parquet"}


def _normalize(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize observations to the canonical schema."""

    if "timestamp" in df.columns:
        df["timestamp"] = pd.to_datetime(df["timestamp"], errors="raise")

    for column in ("variable", "source", "quality"):
        if column in df.columns:
            df[column] = df[column].astype("string")

    return df


def load_observations(path: str | Path) -> pd.DataFrame:
    """
    Load and validate an observation dataset.
    """
    path = Path(path)

    if not path.exists():
        raise FileNotFoundError(path)

    suffix = path.suffix.lower()

    if suffix not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file format '{suffix}'. "
            f"Supported formats: {sorted(SUPPORTED_EXTENSIONS)}."
        )

    if suffix == ".csv":
        df = pd.read_csv(path)

    else:
        df = pd.read_parquet(path)

    df = _normalize(df)

    return validate_observations(df)