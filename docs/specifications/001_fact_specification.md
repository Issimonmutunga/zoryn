# Fact Specification

## Purpose

This specification defines the canonical representation of facts within Zoryn.

Every component of the system operates on facts.

Facts are the only immutable source of truth.

---

# Definition

A fact is an immutable assertion about reality or about knowledge of reality.

A fact may describe

an observation,

a derived quantity,

a hypothesis,

a forecast,

a validation,

or any other immutable statement.

Facts never change.

Corrections generate new facts.

---

# Canonical Structure

Every fact contains

Fact Identifier

Fact Type

Ontology Concept

Event Time

Knowledge Time

Location

Evidence

Confidence

Provenance

Payload

Version

---

# Fact Identifier

Every fact possesses a globally unique identifier.

Identifiers are permanent.

Identifiers are never reused.

---

# Fact Type

Every fact belongs to exactly one fact type.

Examples include

Observation Fact

Derived Fact

Inference Fact

Forecast Fact

Validation Fact

Correction Fact

Decision Fact

Annotation Fact

---

# Ontology Concept

Every fact references one ontology concept.

The ontology defines meaning.

Facts instantiate ontology concepts.

---

# Event Time

The time when the fact became true.

---

# Knowledge Time

The time when Zoryn learned the fact.

Knowledge Time may differ from Event Time.

---

# Spatial Reference

Facts may contain

Point

Line

Polygon

Grid Cell

H3 Cell

Network

Region

Global

Spatial representation is independent of the fact itself.

---

# Evidence

Every derived fact references

zero,

one,

or many

supporting facts.

Evidence therefore forms a directed acyclic graph.

---

# Confidence

Confidence expresses uncertainty.

Confidence belongs to the fact.

It does not belong to projections.

---

# Provenance

Every fact records

origin,

creator,

processing pipeline,

software version,

input datasets,

processing timestamp.

Every fact is reproducible.

---

# Payload

Payload contains the domain-specific content.

Examples

Rainfall amount

River discharge

NDVI

Wildfire perimeter

Crop yield

Temperature

Reservoir storage

Migration estimate

Payload remains independent of the core fact structure.

---

# Version

Facts are immutable.

Version identifies the schema.

Not the content.

---

# Lifecycle

Reality

↓

Observation

↓

Fact

↓

Projection

↓

Reasoning

↓

New Fact

The cycle repeats continuously.

---

# Constraints

Facts

must be immutable,

must be traceable,

must be reproducible,

must be timestamped,

must reference ontology concepts,

must preserve provenance,

must preserve evidence.

---

# Design Principles

1. Facts are immutable.
2. Facts are append-only.
3. Facts are self-describing.
4. Facts are reproducible.
5. Facts are traceable.
6. Facts are ontology-aware.
7. Facts are independent of storage.
8. Facts remain valid indefinitely.