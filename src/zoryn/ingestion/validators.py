"""
Validation utilities for Zoryn observation datasets.
"""

from __future__ import annotations

from typing import Iterable

import pandas as pd

from .schema import field_types, required_fields


def validate_columns(df: pd.DataFrame) -> None:
    """
    Validate that all required columns are present and unique.
    """
    missing = set(required_fields()) - set(df.columns)
    if missing:
        raise ValueError(
            f"Missing required columns: {', '.join(sorted(missing))}"
        )

    duplicates = df.columns[df.columns.duplicated()].tolist()
    if duplicates:
        raise ValueError(
            f"Duplicate column names found: {duplicates}"
        )


def validate_dtypes(df: pd.DataFrame) -> None:
    """
    Validate dataframe dtypes against the canonical schema.
    """
    expected = field_types()

    for column, dtype in expected.items():
        if column not in df.columns:
            continue

        actual = str(df[column].dtype)

        # Allow pandas string/object interchangeably
        if dtype == "string" and actual in ("object", "string"):
            continue

        if actual != dtype:
            raise TypeError(
                f"Column '{column}' has dtype '{actual}', expected '{dtype}'."
            )


def validate_observations(df: pd.DataFrame) -> pd.DataFrame:
    """
    Validate an observation dataframe.

    Returns
    -------
    pandas.DataFrame
        The validated dataframe.
    """
    validate_columns(df)
    validate_dtypes(df)
    return df