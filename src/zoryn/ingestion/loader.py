"""
Observation loading utilities for Zoryn.

This module provides the public entry point for reading observation
datasets from disk. Supported formats are intentionally minimal:
CSV and Parquet.

The loader performs three steps:

1. Read the dataset.
2. Validate it against the canonical observation schema.
3. Return the validated DataFrame.

No cleaning, interpolation or feature engineering occurs here.
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd

from .validators import validate_observations

SUPPORTED_EXTENSIONS = {".csv", ".parquet"}


def load_observations(path: str | Path) -> pd.DataFrame:
    """
    Load and validate an observation dataset.

    Parameters
    ----------
    path
        Path to a CSV or Parquet file.

    Returns
    -------
    pandas.DataFrame
        Validated observation table.

    Raises
    ------
    FileNotFoundError
        If the file does not exist.

    ValueError
        If the file type is unsupported or validation fails.
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

    elif suffix == ".parquet":
        df = pd.read_parquet(path)

    else:
        # Defensive safeguard.
        raise RuntimeError("Unexpected file type.")

    return validate_observations(df)