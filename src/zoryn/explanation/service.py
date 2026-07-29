"""
Explanation service.

Coordinates deterministic reasoning,
scientific references and language-model
generation.

The service never performs environmental
reasoning.

It only explains deterministic reasoning
already produced by Zoryn.
"""

from __future__ import annotations

from .citations import CitationRepository
from .context import ExplanationContext
from .models import Explanation
from .prompt_builder import PromptBuilder
from .provider import ExplanationProvider
from .version import VERSION


class ExplanationService:
    """
    Coordinates explanation generation.
    """

    def __init__(
        self,
        provider: ExplanationProvider,
        citations: CitationRepository | None = None,
        prompt_builder: PromptBuilder | None = None,
    ) -> None:

        self._provider = provider

        self._citations = (
            citations
            if citations is not None
            else CitationRepository()
        )

        self._prompt_builder = (
            prompt_builder
            if prompt_builder is not None
            else PromptBuilder()
        )

    def explain(
        self,
        context: ExplanationContext,
    ) -> Explanation:
        """
        Produce an explanation from deterministic
        reasoning.
        """

        reasoning = context.reasoning

        references = (
            self._citations.references_for(
                reasoning.standard,
                reasoning.patterns.names,
            )
        )

        prompt = (
            self._prompt_builder.build(
                context,
                references,
            )
        )

        response = (
            self._provider.generate(
                prompt,
            )
        )

        explanation = Explanation(
            provider=response.provider,
            model=response.model,
            reasoning_version=VERSION,
            summary=response.summary,
            interpretation=response.interpretation,
            limitations=list(response.limitations),
            references=references,
            latency_ms=response.latency_ms,
            prompt_tokens=response.prompt_tokens,
            completion_tokens=response.completion_tokens,
            total_tokens=response.total_tokens,
            finish_reason=response.finish_reason,
            generated_at=response.generated_at,
        )

        return explanation