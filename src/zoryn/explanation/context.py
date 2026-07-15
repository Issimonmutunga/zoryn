"""
Explanation context.

Provides additional deterministic context used to
generate human-readable explanations.

The explanation context supplements, but never
modifies, the reasoning produced by the
environmental reasoning engine.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from .models import ReasoningPackage


@dataclass(slots=True)
class ExplanationContext:
    """
    Context supplied to the explanation engine.
    """

    reasoning: ReasoningPackage

    generated_at: str

    reasoning_engine: str

    reasoning_version: str

    knowledge_graph_version: str

    reasoning_hash: str

    language: str = "en"

    audience: str = "scientific"

    explanation_style: str = "detailed"

    variables: dict[
        str,
        float | int | str
    ] = field(
        default_factory=dict,
    )

    metadata: dict[
        str,
        str
    ] = field(
        default_factory=dict,
    )