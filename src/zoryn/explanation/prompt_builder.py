"""
Prompt builder.

Builds deterministic prompts for the explanation
engine.

The prompt builder ensures that language models
only explain deterministic reasoning produced by
Zoryn and never invent environmental facts,
evidence or scientific conclusions.
"""

from __future__ import annotations

from .context import ExplanationContext
from .models import PromptPackage
from .models import ScientificReference


SYSTEM_PROMPT = """
You are the explanation engine for Zoryn, a
deterministic environmental reasoning system.

- Explain only the supplied deterministic reasoning.
- Never invent facts, evidence, patterns, or references.
- Use only the supplied scientific references.
- If information is missing, explicitly say so.
- Return JSON only.
""".strip()


class PromptBuilder:
    """
    Builds deterministic prompts for the
    explanation engine.
    """

    def build(
        self,
        context: ExplanationContext,
        references: list[
            ScientificReference
        ],
    ) -> PromptPackage:

        reasoning = context.reasoning

        prompt = f"""
==============================
DETERMINISTIC REASONING
==============================

Discovery

{reasoning.discovery}

Hypothesis

{reasoning.hypothesis}

Confidence

{reasoning.confidence:.2f}

Scientific Standard

{reasoning.standard}

Evidence Items

{reasoning.evidence.evidence_count}

Observed Variables

{chr(10).join("- " + variable for variable in reasoning.evidence.variables) if reasoning.evidence.variables else "None supplied."}

Detected Pattern Count

{reasoning.patterns.pattern_count}

Detected Patterns

{chr(10).join("- " + pattern for pattern in reasoning.patterns.names) if reasoning.patterns.names else "None supplied."}

==============================
AUTHORITATIVE REFERENCES
==============================

{self._references(references)}

==============================
TASK
==============================

Using ONLY the supplied deterministic reasoning
and ONLY the supplied scientific references,
return EXACTLY the following JSON object and
nothing else:

{{
  "summary": "...",
  "interpretation": "...",
  "limitations": [
    "...",
    "...",
    "..."
  ]
}}

Rules:

- summary: 2-3 concise sentences giving an overview
  of the environmental condition.
- interpretation: 2-3 concise sentences interpreting
  the supplied reasoning using ONLY the supplied
  references.
- limitations: 2-3 short bullet items describing what
  cannot be concluded from the supplied reasoning.
- Do not restate information that will already be presented
  separately by the application.
- Do not invent information. If something is not
  supplied, state that it was not supplied.
- Do not cite references that were not supplied.
- Return valid JSON only, with no surrounding text.
""".strip()

        return PromptPackage(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=prompt,
            references=references,
        )

    @staticmethod
    def _references(
        references: list[
            ScientificReference
        ],
    ) -> str:

        if not references:
            return "No references supplied."

        return "\n".join(
            f"- {reference.source}: {reference.title}"
            for reference in references
        )