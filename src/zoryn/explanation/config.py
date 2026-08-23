"""
Explanation subsystem configuration.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from dotenv import load_dotenv

@dataclass(slots=True, frozen=True)
class GroqConfiguration:
    """
    Configuration for the Groq provider.
    """

    api_key: str

    model: str

    temperature: float

    max_tokens: int

    timeout_seconds: float


def load_groq_configuration() -> GroqConfiguration:
    """
    Load Groq configuration from environment
    variables.
    """
    load_dotenv()
    return GroqConfiguration(
        api_key=os.getenv(
            "GROQ_API_KEY",
            "",
        ),
        model=os.getenv(
            "GROQ_MODEL",
            "llama-3.3-70b-versatile",
        ),
        temperature=float(
            os.getenv(
                "GROQ_TEMPERATURE",
                "0.1",
            ),
        ),
        max_tokens=int(
            os.getenv(
                "GROQ_MAX_TOKENS",
                "800",
            ),
        ),
        timeout_seconds=float(
            os.getenv(
                "GROQ_TIMEOUT",
                "60",
            ),
        ),
    )