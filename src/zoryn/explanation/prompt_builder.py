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
You are the explanation engine for Zoryn.

Zoryn is a deterministic environmental reasoning
system.

Your purpose is to explain deterministic
scientific reasoning in clear language.

You SHALL:

- explain supplied discoveries;
- explain supplied hypotheses;
- explain supplied evidence;
- explain supplied environmental patterns;
- explain supplied scientific standards;
- explain supplied confidence values;
- cite supplied scientific references.

You SHALL NEVER:

- invent observations;
- invent evidence;
- invent environmental patterns;
- invent discoveries;
- invent hypotheses;
- invent confidence values;
- invent scientific references;
- contradict supplied reasoning;
- speculate beyond supplied information.

If information has not been supplied, explicitly
state that it is unavailable.

The deterministic reasoning engine is the
scientific authority.

You are an explanation engine.

You do not perform environmental reasoning.
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
EXPLANATION CONTEXT
==============================

Reasoning Engine

{context.reasoning_engine}

Reasoning Version

{context.reasoning_version}

Knowledge Graph Version

{context.knowledge_graph_version}

Reasoning Hash

{context.reasoning_hash}

Language

{context.language}

Audience

{context.audience}

Explanation Style

{context.explanation_style}

Additional Variables

{self._variables(context)}

==============================
AUTHORITATIVE REFERENCES
==============================

{self._references(references)}

==============================
TASK
==============================

Using ONLY the supplied deterministic reasoning
and ONLY the supplied scientific references,
produce a scientific explanation.

Do not invent any information.

Do not reinterpret the supplied discovery.

Do not alter confidence values.

Do not create additional evidence.

Do not create additional patterns.

Do not cite references that were not supplied.

If information is unavailable, explicitly state
that it was not supplied.

Return EXACTLY the following Markdown structure.

# Executive Summary

Provide a concise overview of the environmental
condition.

# Discovery

Explain the supplied discovery.

# Hypothesis

Explain why the supplied hypothesis supports the
discovery.

# Supporting Evidence

Explain how the supplied evidence supports the
hypothesis.

Include the supplied evidence count.

# Detected Environmental Patterns

Explain every supplied environmental pattern.

Include the supplied pattern count.

# Scientific Interpretation

Interpret the supplied reasoning using ONLY the
supplied scientific references.

# Confidence Assessment

Explain the meaning of the supplied confidence.

Do not reinterpret the confidence.

# Limitations

Clearly explain:

- what the deterministic reasoning supports;
- what it does not support;
- what cannot be concluded.

Distinguish evidence from uncertainty.

# Scientific References

List ONLY the supplied scientific references.

Do not create additional references.

End after the Scientific References section.
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

        return "\n\n".join(
            (
                f"Source: {reference.source}\n"
                f"Section: {reference.section}\n"
                f"Title: {reference.title}\n"
                f"Excerpt:\n"
                f"{reference.excerpt}"
            )
            for reference in references
        )

    @staticmethod
    def _variables(
        context: ExplanationContext,
    ) -> str:

        if not context.variables:
            return "None supplied."

        return "\n".join(
            f"- {key}: {value}"
            for key, value in sorted(
                context.variables.items()
            )
        )