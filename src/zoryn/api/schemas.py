"""
API response schemas.
"""

from __future__ import annotations

from pydantic import BaseModel


class HealthResponse(
    BaseModel,
):

    status: str


class VersionResponse(
    BaseModel,
):

    name: str

    version: str

    api: str


class DiscoveryResponse(
    BaseModel,
):

    h3_id: str

    discovery: str | None


class DiscoveriesResponse(
    BaseModel,
):

    discoveries: list[
        DiscoveryResponse
    ] = []


class HypothesisResponse(
    BaseModel,
):

    h3_id: str

    hypothesis: str | None
class PatternResponse(
    BaseModel,
):

    h3_id: str

    patterns: list[
        str
    ] = []


class EvidenceResponse(
    BaseModel,
):

    h3_id: str

    evidence: list[
        str
    ] = []


class HistoryResponse(
    BaseModel,
):

    h3_id: str

    history: list[
        dict
    ] = []