"""
REST API routes.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from .dependencies import get_knowledge
from .repository import KnowledgeRepository
from .schemas import (
    DiscoveryResponse,
    EvidenceResponse,
    HealthResponse,
    HistoryResponse,
    HypothesisResponse,
    PatternResponse,
    VersionResponse,
)
from .spatial_repository import SpatialRepository


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
    repository: KnowledgeRepository = Depends(
        get_repository,
    ),
):

    return repository.discoveries()


@router.get(
    "/discoveries/{h3_id}",
    tags=["Discoveries"],
    response_model=DiscoveryResponse,
)
def discovery(
    h3_id: str,
    repository: KnowledgeRepository = Depends(
        get_repository,
    ),
):

    discovery = repository.discovery(
        h3_id
    )

    if discovery is None:

        raise HTTPException(
            status_code=404,
            detail="Discovery not found.",
        )

    return discovery


@router.get(
    "/map/discoveries",
    tags=["Map"],
)
def map_discoveries(
    repository: KnowledgeRepository = Depends(
        get_repository,
    ),
):

    spatial = SpatialRepository(
        repository
    )

    return spatial.map_discoveries()


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
):

    #
    # Future implementation.
    #

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