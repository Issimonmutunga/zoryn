"""
Validation utilities for Zoryn observation datasets.
"""

from __future__ import annotations

import pandas as pd
from pandas.api.types import (
    is_datetime64_dtype,
    is_float_dtype,
    is_string_dtype,
)

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

        series = df[column]

        if dtype.startswith("datetime64"):
            if not is_datetime64_dtype(series):
                raise TypeError(
                    f"Column '{column}' must be a datetime64 type."
                )
            continue

        if dtype == "float64":
            if not is_float_dtype(series):
                raise TypeError(
                    f"Column '{column}' must be a floating-point type."
                )
            continue

        if dtype == "string":
            if not (is_string_dtype(series) or series.dtype == object):
                raise TypeError(
                    f"Column '{column}' must be a string type."
                )
            continue


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