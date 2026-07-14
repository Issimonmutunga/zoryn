"""
API response schemas.
"""

from __future__ import annotations

from pydantic import BaseModel


class HealthResponse(
    BaseModel,
):

    status: str

    discoveries: int


class VersionResponse(
    BaseModel,
):

    name: str

    version: str

    api: str


class DiscoveryResponse(
    BaseModel,
):

    id: str

    hypothesis_id: str

    h3_id: str

    name: str

    confidence: float

    start: str

    end: str


class HypothesisResponse(
    BaseModel,
):

    id: str

    h3_id: str

    name: str

    confidence: float

    start: str

    end: str


class PatternResponse(
    BaseModel,
):

    id: str

    hypothesis_id: str

    name: str

    confidence: float


class EvidenceResponse(
    BaseModel,
):

    id: str

    pattern_id: str

    variable: str

    value: str | float | int

    unit: str | None = None


class HistoryResponse(
    BaseModel,
):

    h3_id: str

    history: list[
        dict
    ] = []