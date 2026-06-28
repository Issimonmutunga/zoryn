# Ontology Specification

## Purpose

This specification defines the canonical ontology used throughout Zoryn.

The ontology provides a common language for every fact, process,
projection and theory.

No component may introduce concepts outside the ontology without
extending it.

---

# Goals

The ontology shall

provide consistent meaning,

remain implementation independent,

remain dataset independent,

support continual evolution,

remain scientifically coherent.

---

# Ontology Structure

The ontology is hierarchical.

Root Concept

↓

Domain

↓

Concept

↓

Subconcept

↓

Instance

Facts always reference Concepts.

They never reference Instances directly.

---

# Root Domains

The ontology currently defines six root domains.

Earth System

Living System

Human System

Infrastructure System

Knowledge System

Time System

Future domains may be added without changing existing identifiers.

---

# Concept Identifier

Every ontology concept possesses

Ontology Identifier

Canonical Name

Description

Parent Concept

Aliases

Status

Identifiers are immutable.

Names may evolve.

---

# Relationships

Concepts may participate in semantic relationships.

Examples include

is_a

part_of

depends_on

produces

consumes

affects

causes

precedes

derived_from

Relationships are first-class ontology objects.

---

# Versioning

The ontology evolves.

Concept identifiers never change.

Deprecated concepts remain valid for historical facts.

---

# Extensibility

New concepts may be introduced only if

no existing concept adequately represents them,

they possess a clear scientific definition,

their relationship to existing concepts is defined.

---

# Validation Rules

Every fact must reference

exactly one ontology concept.

Every concept must belong to

exactly one parent domain.

Every concept identifier must be globally unique.

Circular ontology relationships are prohibited.

---

# Design Principles

1. Meaning is defined by the ontology.
2. Facts instantiate ontology concepts.
3. Concepts outlive datasets.
4. The ontology evolves without breaking history.
5. Relationships are ontology concepts.
6. Scientific consistency is preserved.
7. The ontology remains implementation independent.
8. Every fact is semantically interpretable.