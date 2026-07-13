"""
REST API routes.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from .dependencies import get_knowledge
from .repository import KnowledgeRepository


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
    "/hypotheses/{hypothesis_id}",
    tags=["Hypotheses"],
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
)
def version():

    return {
        "name": "Zoryn",
        "version": "0.1.0",
        "api": "pilot",
    }