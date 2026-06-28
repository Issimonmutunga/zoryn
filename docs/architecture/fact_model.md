# Fact Model

## Purpose

Facts are the only source of truth in Zoryn.

Everything else—including graphs, memories, forecasts,
knowledge and explanations—is derived from facts.

Facts are never modified.

Facts never disappear.

Facts accumulate.

---

# What is a Fact?

A fact is an immutable statement about the Earth.

Examples

- Rainfall measured
- River level observed
- Soil moisture estimated
- Satellite image acquired
- Hypothesis generated
- Forecast produced
- Human report received
- Wildfire detected

Facts are observations of reality or products of reasoning.

Both are immutable.

---

# Properties of a Fact

Every fact possesses

- identity
- timestamp
- provenance
- confidence
- evidence
- causality
- semantics

No fact exists without these properties.

---

# Identity

Every fact has a globally unique identifier.

Identifiers never change.

---

# Time

Every fact contains two timestamps.

Event Time

The moment the fact became true.

Knowledge Time

The moment Zoryn learned the fact.

These may differ.

---

# Provenance

Every fact records

- source
- processing chain
- creator
- dataset
- model
- software version

Nothing enters the system anonymously.

---

# Confidence

Facts possess uncertainty.

Confidence is attached to the fact itself.

Not to the projection.

---

# Evidence

Every derived fact references the facts that produced it.

Evidence therefore forms a directed acyclic graph.

Nothing appears without evidence.

---

# Causality

Facts may reference

Previous facts

Current facts

Future hypotheses

This allows causal reasoning.

---

# Semantics

Every fact belongs to an ontology.

Examples

Observation

Inference

Forecast

Hypothesis

Validation

Correction

Human Annotation

The ontology may evolve.

---

# Immutability

Facts never change.

Corrections generate new facts.

History remains complete.

---

# Design Rules

1. Facts are immutable.
2. Facts are append-only.
3. Every fact has provenance.
4. Every fact has evidence.
5. Every fact has temporal meaning.
6. Every fact participates in causality.
7. Every projection is derived from facts.