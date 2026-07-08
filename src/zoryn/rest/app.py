"""
Zoryn Pilot REST API.
"""

from __future__ import annotations

from fastapi import FastAPI

from .routes import router


app = FastAPI(
    title="Zoryn",
    description=(
        "Environmental reasoning engine."
    ),
    version="0.1.0",
)

app.include_router(
    router,
)


@app.get(
    "/",
    tags=["System"],
)
def root() -> dict[str, str]:

    return {
        "name": "Zoryn",
        "version": "0.1.0",
        "status": "running",
    }
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

    """
    Return discovered environmental hazards.

    Placeholder for the pilot.
    """

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