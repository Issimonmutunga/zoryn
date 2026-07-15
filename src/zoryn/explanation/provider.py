"""
Language model provider interface.

This module isolates external language models
from the rest of the explanation subsystem.

The explanation subsystem never depends on a
specific provider implementation.
"""

from __future__ import annotations

from abc import ABC
from abc import abstractmethod

from .models import PromptPackage
from .models import ProviderResponse
from datetime import datetime, UTC

class ExplanationProvider(ABC):
    """
    Abstract language model provider.
    """

    @property
    @abstractmethod
    def provider_name(
        self,
    ) -> str:
        """
        Human-readable provider name.
        """

    @property
    @abstractmethod
    def model_name(
        self,
    ) -> str:
        """
        Model identifier.
        """

    @abstractmethod
    def generate(
        self,
        prompt: PromptPackage,
    ) -> ProviderResponse:
        """
        Generate an explanation.

        The implementation must only explain the
        supplied prompt and must not modify the
        supplied reasoning.
        """


class StubProvider(
    ExplanationProvider,
):
    """
    Deterministic placeholder provider.

    Used until an external language model
    provider is configured.
    """

    @property
    def provider_name(
        self,
    ) -> str:

        return "Stub"

    @property
    def model_name(
        self,
    ) -> str:

        return "Deterministic Placeholder"

    def generate(
        self,
        prompt: PromptPackage,
    ) -> ProviderResponse:

        return ProviderResponse(
            provider=self.provider_name,
            model=self.model_name,
            explanation=(
                "Explanation generation has not "
                "yet been configured."
            ),
            latency_ms=0.0,
            prompt_tokens=0,
            completion_tokens=0,
            total_tokens=0,
            finish_reason="stub",
            generated_at=datetime.now(
                UTC,
            ).isoformat(),
        )