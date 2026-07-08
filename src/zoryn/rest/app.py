"""
Zoryn Pilot REST API.
"""

from __future__ import annotations

from fastapi import FastAPI

from .routes import router


app = FastAPI(
    title="Zoryn",
    description="Environmental reasoning engine.",
    version="0.1.0",
)

app.include_router(router)


@app.get("/", tags=["System"])
def root() -> dict[str, str]:

    return {
        "name": "Zoryn",
        "version": "0.1.0",
        "status": "running",
    }