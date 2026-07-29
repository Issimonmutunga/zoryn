"""
Groq explanation provider.

Uses the Groq OpenAI-compatible API to generate
scientific explanations.

This module is the only part of Zoryn that knows
how to communicate with Groq.
"""

from __future__ import annotations

import json

from datetime import UTC
from datetime import datetime
from time import perf_counter

from openai import OpenAI

from ..config import load_groq_configuration
from ..models import PromptPackage
from ..models import ProviderResponse
from ..provider import ExplanationProvider


class GroqProvider(
    ExplanationProvider,
):
    """
    Groq explanation provider.
    """

    def __init__(
        self,
    ) -> None:

        self._config = (
            load_groq_configuration()
        )

        if not self._config.api_key:

            raise RuntimeError(
                "GROQ_API_KEY environment "
                "variable is not configured."
            )

        self._client = OpenAI(
            api_key=self._config.api_key,
            base_url=(
                "https://api.groq.com/openai/v1"
            ),
        )

    @property
    def provider_name(
        self,
    ) -> str:

        return "Groq"

    @property
    def model_name(
        self,
    ) -> str:

        return self._config.model

    def generate(
        self,
        prompt: PromptPackage,
    ) -> ProviderResponse:
        """
        Generate an explanation using Groq.
        """

        start = perf_counter()

        response = (
            self._client.chat.completions.create(
                model=self._config.model,
                temperature=(
                    self._config.temperature
                ),
                max_tokens=(
                    self._config.max_tokens
                ),
                messages=[
                    {
                        "role": "system",
                        "content": (
                            prompt.system_prompt
                        ),
                    },
                    {
                        "role": "user",
                        "content": (
                            prompt.user_prompt
                        ),
                    },
                ],
            )
        )

        latency = (
            perf_counter() - start
        ) * 1000.0

        choice = response.choices[0]

        usage = response.usage

        raw = choice.message.content or ""

        try:

            payload = json.loads(raw)

            summary = payload.get(
                "summary", ""
            )

            interpretation = payload.get(
                "interpretation", ""
            )

            limitations = payload.get(
                "limitations", []
            )

            if not isinstance(
                limitations, list
            ):

                limitations = []

        except (
            json.JSONDecodeError,
            AttributeError,
        ):

            summary = raw

            interpretation = ""

            limitations = []

        return ProviderResponse(
            provider=self.provider_name,
            model=self.model_name,
            summary=summary,
            interpretation=interpretation,
            limitations=limitations,
            latency_ms=latency,
            prompt_tokens=(
                usage.prompt_tokens
                if usage
                else 0
            ),
            completion_tokens=(
                usage.completion_tokens
                if usage
                else 0
            ),
            total_tokens=(
                usage.total_tokens
                if usage
                else 0
            ),
            finish_reason=(
                choice.finish_reason or ""
            ),
            generated_at=datetime.now(
                UTC,
            ).isoformat(),
        )