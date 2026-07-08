"""
REST API routes.
"""

from __future__ import annotations

from fastapi import APIRouter

router = APIRouter()


@router.get(
    "/health",
    tags=["System"],
)
def health() -> dict[str, str]:

    return {
        "status": "healthy",
    }


@router.get(
    "/discoveries",
    tags=["Discoveries"],
)
def discoveries():

    return []


@router.get(
    "/discoveries/{h3_id}",
    tags=["Discoveries"],
)
def discovery(
    h3_id: str,
):

    return {
        "h3_id": h3_id,
        "discovery": None,
    }


@router.get(
    "/hypotheses/{h3_id}",
    tags=["Hypotheses"],
)
def hypothesis(
    h3_id: str,
):

    return {
        "h3_id": h3_id,
        "hypothesis": None,
    }


@router.get(
    "/patterns/{h3_id}",
    tags=["Patterns"],
)
def patterns(
    h3_id: str,
):

    return {
        "h3_id": h3_id,
        "patterns": [],
    }


@router.get(
    "/evidence/{h3_id}",
    tags=["Evidence"],
)
def evidence(
    h3_id: str,
):

    return {
        "h3_id": h3_id,
        "evidence": [],
    }


@router.get(
    "/history/{h3_id}",
    tags=["History"],
)
def history(
    h3_id: str,
):

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