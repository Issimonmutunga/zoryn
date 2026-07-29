"""
API response schemas.
"""

from __future__ import annotations

from pydantic import BaseModel


class HealthResponse(BaseModel):

    status: str

    discoveries: int


class VersionResponse(BaseModel):

    name: str

    version: str

    api: str


class DiscoveryResponse(BaseModel):

    id: str

    hypothesis_id: str

    h3_id: str

    name: str

    confidence: float

    start: str

    end: str

    spi3: float | None = None

    spi6: float | None = None

    spi12: float | None = None

class DiscoveriesResponse(BaseModel):

    discoveries: list[DiscoveryResponse] = []


class HypothesisResponse(BaseModel):

    id: str

    name: str

    confidence: float


class PatternResponse(BaseModel):

    id: str

    name: str

    confidence: float

    frequency: int

    standard: str


class EvidenceResponse(BaseModel):

    id: str

    h3_id: str

    timestamp: str

    variable: str

    direction: str

    strength: float


class HistoryResponse(BaseModel):

    h3_id: str

    history: list[dict] = []


# ------------------------------------------------------------------
# New deterministic reasoning responses
# ------------------------------------------------------------------


class EvidenceSummaryResponse(BaseModel):

    evidence_count: int

    variables: list[str]


class PatternSummaryResponse(BaseModel):

    pattern_count: int

    names: list[str]


class ReasoningResponse(
    BaseModel,
):

    discovery: DiscoveryResponse

    hypothesis: HypothesisResponse

    patterns: list[
        PatternResponse
    ]

    evidence: list[
        EvidenceResponse
    ]


# ------------------------------------------------------------------
# Explanation responses
# ------------------------------------------------------------------


class ReferenceResponse(BaseModel):

    source: str

    section: str

    title: str

    excerpt: str


class ExplanationResponse(BaseModel):

    available: bool

    summary: str

    discovery: str

    hypothesis: str

    confidence: float

    standard: str

    evidence: EvidenceSummaryResponse

    patterns: PatternSummaryResponse

    interpretation: str

    limitations: list[str]

    references: list[ReferenceResponse]