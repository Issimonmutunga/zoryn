"""
Canonical observation schema for Zoryn.

The schema intentionally remains generic so that observations from any
Earth system (weather, hydrology, vegetation, ocean, etc.) can be
represented uniformly.

Downstream components should depend on this schema rather than on
dataset-specific formats.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Tuple


@dataclass(frozen=True)
class Field:
    """Definition of a single observation field."""

    name: str
    dtype: str
    required: bool = True


OBSERVATION_SCHEMA: Tuple[Field, ...] = (
    Field("timestamp", "datetime64[ns]"),
    Field("latitude", "float64"),
    Field("longitude", "float64"),
    Field("variable", "string"),
    Field("value", "float64"),
    Field("source", "string"),
    Field("quality", "string", required=False),
)


def required_fields() -> Tuple[str, ...]:
    """Return the required field names."""
    return tuple(field.name for field in OBSERVATION_SCHEMA if field.required)


def field_types() -> Dict[str, str]:
    """Return the expected dtype for each field."""
    return {field.name: field.dtype for field in OBSERVATION_SCHEMA}