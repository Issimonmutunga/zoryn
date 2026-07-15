"""
Explanation subsystem models.

These models define the contract between the
deterministic reasoning engine and the
explanation engine.

The explanation subsystem never consumes raw
environmental observations. It only receives
structured reasoning outputs.
"""

from __future__ import annotations

from dataclasses import dataclass, field


# ---------------------------------------------------------
# Scientific references
# ---------------------------------------------------------


@dataclass(slots=True)
class ScientificReference:
    """
    Scientific citation supporting an explanation.
    """

    source: str
    section: str
    title: str
    excerpt: str


# ---------------------------------------------------------
# Evidence summary
# ---------------------------------------------------------


@dataclass(slots=True)
class EvidenceSummary:
    """
    Summary of evidence supporting a hypothesis.
    """

    evidence_count: int
    variables: list[str] = field(
        default_factory=list,
    )


# ---------------------------------------------------------
# Pattern summary
# ---------------------------------------------------------


@dataclass(slots=True)
class PatternSummary:
    """
    Summary of detected environmental patterns.
    """

    pattern_count: int

    names: list[str] = field(
        default_factory=list,
    )


# ---------------------------------------------------------
# Reasoning package
# ---------------------------------------------------------


@dataclass(slots=True)
class ReasoningPackage:
    """
    Deterministic reasoning supplied to the
    explanation engine.

    This is the ONLY input accepted by the
    explanation subsystem.
    """

    h3_id: str

    discovery: str

    hypothesis: str

    confidence: float

    standard: str

    evidence: EvidenceSummary

    patterns: PatternSummary


# ---------------------------------------------------------
# Prompt package
# ---------------------------------------------------------


@dataclass(slots=True)
class PromptPackage:
    """
    Prompt supplied to an LLM provider.
    """

    system_prompt: str

    user_prompt: str

    references: list[
        ScientificReference
    ] = field(
        default_factory=list,
    )


# ---------------------------------------------------------
# Provider response
# ---------------------------------------------------------


@dataclass(slots=True)
class ProviderResponse:
    """
    Response returned by a language model provider.
    """

    provider: str

    model: str

    explanation: str

    latency_ms: float

    prompt_tokens: int

    completion_tokens: int

    total_tokens: int

    finish_reason: str

    generated_at: str

# ---------------------------------------------------------
# Explanation
# ---------------------------------------------------------


@dataclass(slots=True)
class Explanation:
    """
    Final explanation returned by the explanation
    subsystem.
    """

    provider: str

    model: str

    reasoning_version: str

    explanation: str

    references: list[
        ScientificReference
    ] = field(
        default_factory=list,
    )

    latency_ms: float = 0.0

    prompt_tokens: int = 0

    completion_tokens: int = 0

    total_tokens: int = 0

    finish_reason: str = ""

    generated_at: str = ""