"""
Zoryn Pilot REST API.
"""

from __future__ import annotations

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#
# Load local environment variables.
#
# In production, environment variables supplied by
# the hosting platform take precedence.
#
load_dotenv()

from .routes import router

app = FastAPI(
    title="Zoryn",
    description="Environmental reasoning engine.",
    version="0.1.0",
)

#
# Allowed frontend origins.
#
# FRONTEND_URL holds one origin, or several separated by
# commas (for example a hosted site and a custom domain).
#
# FRONTEND_ORIGIN_REGEX optionally allows origins by
# pattern. Hosts such as Render may add a suffix to a
# site's address, which a fixed list cannot anticipate.
#
frontend_origin = os.getenv("FRONTEND_URL")

frontend_origin_regex = (
    os.getenv("FRONTEND_ORIGIN_REGEX") or None
)

allowed_origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]

if frontend_origin:
    allowed_origins.extend(
        origin.strip().rstrip("/")
        for origin in frontend_origin.split(",")
        if origin.strip()
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=frontend_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/", tags=["System"])
def root() -> dict[str, str]:

    return {
        "name": "Zoryn",
        "version": "0.1.0",
        "status": "running",
    }