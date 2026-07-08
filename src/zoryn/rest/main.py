"""
API entry point.

Run with

    uvicorn zoryn.api.main:app --reload
"""

from __future__ import annotations

import uvicorn

from .app import app


def main() -> None:
    """
    Run the development server.
    """

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False,
    )


if __name__ == "__main__":

    main()