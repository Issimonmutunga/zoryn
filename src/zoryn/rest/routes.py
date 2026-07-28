"""
REST API routes.
"""

from __future__ import annotations

from datetime import UTC
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query

from .dependencies import get_knowledge
from .repository import KnowledgeRepository
from .schemas import (
    DiscoveryResponse,
    EvidenceResponse,
    HealthResponse,
    HistoryResponse,
    HypothesisResponse,
    PatternResponse,
    ReasoningResponse,
    VersionResponse,
)
from .spatial_repository import SpatialRepository

from zoryn.explanation.context import ExplanationContext
from zoryn.explanation.factory import create_provider
from zoryn.explanation.models import (
    EvidenceSummary,
    PatternSummary,
    ReasoningPackage,
)
from zoryn.explanation.service import ExplanationService


router = APIRouter()


def get_repository() -> KnowledgeRepository:
    """
    Return the knowledge repository.
    """

    return KnowledgeRepository(
        get_knowledge()
    )


@router.get(
    "/health",
    tags=["System"],
    response_model=HealthResponse,
)
def health(
    repository: KnowledgeRepository = Depends(
        get_repository,
    ),
):

    return {
        "status": "healthy",
        "discoveries": len(
            repository.discoveries()
        ),
    }


@router.get(
    "/discoveries",
    tags=["Discoveries"],
    response_model=list[DiscoveryResponse],
)
def discoveries(
    timestamp: str | None = Query(default=None),
    repository: KnowledgeRepository = Depends(get_repository),
):
    return repository.discoveries(timestamp=timestamp)

@router.get(
    "/discoveries/timeline",
    tags=["Discoveries"],
)
def discovery_timeline(
    repository: KnowledgeRepository = Depends(
        get_repository,
    ),
):
    """
    Return the number of discoveries
    available for each timestamp.
    """

    return repository.discovery_timeline()

@router.get(
    "/discoveries/highlights",
    tags=["Discoveries"],
)
def discovery_highlights(
    timestamp: str = Query(...),
    repository: KnowledgeRepository = Depends(
        get_repository,
    ),
):
    """
    Return the H3 cells that contain
    environmental discoveries for the
    selected timestamp.
    """

    return repository.discovery_highlights(
        timestamp,
    )

@router.get(
    "/discoveries/{h3_id}",
    tags=["Discoveries"],
    response_model=DiscoveryResponse,
)
def discovery(
    h3_id: str,
    timestamp: str | None = Query(default=None),
    repository: KnowledgeRepository = Depends(
        get_repository,
    ),
):

    discovery = repository.discovery(
        h3_id,
        timestamp=timestamp,
    )

    if discovery is None:

        raise HTTPException(
            status_code=404,
            detail="Discovery not found.",
        )

    return discovery


@router.get(
    "/reasoning/{h3_id}",
    tags=["Reasoning"],
)
def reasoning(
    h3_id: str,
    timestamp: str | None = Query(default=None),
    repository: KnowledgeRepository = Depends(
        get_repository,
    ),
):

    graph = repository.reasoning(
        h3_id,
        timestamp=timestamp,
    )

    if graph is None:

        return {
            "available": False,
            "message": (
                "No environmental discovery "
                "was detected for the selected "
                "location and month."
            ),
        }

    return graph


@router.get(
    "/reasoning/{h3_id}/explanation",
    tags=["Reasoning"],
)
def explanation(
    h3_id: str,
    timestamp: str | None = Query(default=None),
    repository: KnowledgeRepository = Depends(
        get_repository,
    ),
):

    graph = repository.reasoning(
        h3_id,
        timestamp=timestamp,
    )

    if graph is None:

        return {
            "available": False,
            "message": (
                "No environmental discovery "
                "was detected for the selected "
                "location and month."
            ),
        }

    discovery = graph["discovery"]
    hypothesis = graph["hypothesis"]
    patterns = graph["patterns"]
    evidence = graph["evidence"]

    reasoning = ReasoningPackage(
        h3_id=h3_id,
        discovery=discovery["name"],
        hypothesis=hypothesis["name"],
        confidence=float(
            discovery["confidence"],
        ),
        standard=(
            patterns[0]["standard"]
            if patterns
            else "Unknown"
        ),
        evidence=EvidenceSummary(
            evidence_count=len(evidence),
            variables=sorted(
                {
                    item["variable"]
                    for item in evidence
                },
            ),
        ),
        patterns=PatternSummary(
            pattern_count=len(patterns),
            names=[
                pattern["name"]
                for pattern in patterns
            ],
        ),
    )

    context = ExplanationContext(
        reasoning=reasoning,
        generated_at=datetime.now(
            UTC,
        ).isoformat(),
        reasoning_engine="Zoryn",
        reasoning_version="0.1.0",
        knowledge_graph_version="pilot",
        reasoning_hash=h3_id,
    )

    service = ExplanationService(
        provider=create_provider(),
    )

    return service.explain(
        context,
    )


@router.get(
    "/map/geometry",
    tags=["Map"],
)
def map_geometry(
    repository: KnowledgeRepository = Depends(
        get_repository,
    ),
):

    spatial = SpatialRepository(
        repository,
    )

    return spatial.geometry()


@router.get(
    "/map/spi",
    tags=["Map"],
)
def map_spi(
    timestamp: str = Query(...),
    repository: KnowledgeRepository = Depends(
        get_repository,
    ),
):

    spatial = SpatialRepository(
        repository,
    )

    return spatial.map_spi(
        timestamp,
    )


@router.get(
    "/hypotheses/{hypothesis_id}",
    tags=["Hypotheses"],
    response_model=HypothesisResponse,
)
def hypothesis(
    hypothesis_id: str,
    repository: KnowledgeRepository = Depends(
        get_repository,
    ),
):

    hypothesis = repository.hypothesis(
        hypothesis_id
    )

    if hypothesis is None:

        raise HTTPException(
            status_code=404,
            detail="Hypothesis not found.",
        )

    return hypothesis


@router.get(
    "/patterns/{hypothesis_id}",
    tags=["Patterns"],
    response_model=list[PatternResponse],
)
def patterns(
    hypothesis_id: str,
    repository: KnowledgeRepository = Depends(
        get_repository,
    ),
):

    return repository.patterns(
        hypothesis_id
    )


@router.get(
    "/evidence/{pattern_id}",
    tags=["Evidence"],
    response_model=list[EvidenceResponse],
)
def evidence(
    pattern_id: str,
    repository: KnowledgeRepository = Depends(
        get_repository,
    ),
):

    return repository.evidence(
        pattern_id
    )


@router.get(
    "/history/{h3_id}",
    tags=["History"],
    response_model=HistoryResponse,
)
def history(
    h3_id: str,
    timestamp: str | None = Query(default=None),
):

    return {
        "h3_id": h3_id,
        "history": [],
    }


@router.get(
    "/version",
    tags=["System"],
    response_model=VersionResponse,
)
def version():

    return {
        "name": "Zoryn",
        "version": "0.1.0",
        "api": "pilot",
    }