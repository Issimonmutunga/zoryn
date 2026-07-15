"""
Explanation provider factory.

Constructs the configured language-model provider.

This module isolates provider selection from the
rest of the explanation subsystem.
"""

from __future__ import annotations

import os

from .provider import ExplanationProvider
from .provider import StubProvider
from .providers.groq import GroqProvider


def create_provider() -> ExplanationProvider:
    """
    Create the configured explanation provider.
    """

    provider = (
        os.getenv(
            "ZORYN_EXPLANATION_PROVIDER",
            "stub",
        )
        .strip()
        .lower()
    )

    if provider == "groq":
        return GroqProvider()

    if provider == "stub":
        return StubProvider()

    raise ValueError(
        f"Unknown explanation provider: "
        f"{provider}"
    )