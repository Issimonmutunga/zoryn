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


class DiscoveriesResponse(
    BaseModel,
):

    discoveries: list[
        DiscoveryResponse
    ] = []


class HypothesisResponse(
    BaseModel,
):

    id: str

    name: str

    confidence: float


class PatternResponse(
    BaseModel,
):

    id: str

    name: str

    confidence: float

    frequency: int

    standard: str


class EvidenceResponse(
    BaseModel,
):

    id: str

    h3_id: str

    timestamp: str

    variable: str

    direction: str

    strength: float


class HistoryResponse(
    BaseModel,
):

    h3_id: str

    history: list[
        dict
    ] = []