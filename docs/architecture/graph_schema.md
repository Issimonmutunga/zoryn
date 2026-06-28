# Graph Schema

## Purpose

This document defines the canonical structure of the Zoryn Temporal Earth Knowledge Graph (TEKG).

Every component of Zoryn must create, update, query or reason over this schema.

---

# Core Object Types

The graph contains five primary object types.

```
Entity
Observation
State
Relationship
Episode
```

Everything else is derived.

---

# Entity

A persistent real-world object.

Properties

- id
- type
- geometry
- created_at
- metadata

Examples

- H3 Cell
- River
- Lake
- Forest
- Road
- Reservoir
- Weather Station
- Administrative Region

Entities are immutable.

Only their states evolve.

---

# Observation

An immutable measurement.

Properties

- id
- entity_id
- variable
- value
- unit
- source
- quality
- observed_at

Observations never change.

---

# State

The condition of an entity at a specific time.

Properties

- id
- entity_id
- timestamp
- embedding
- confidence
- derived_attributes

States are immutable.

Each new observation produces a new state.

---

# Relationship

A connection between two entities or states.

Properties

- id
- source
- target
- relationship_type
- weight
- confidence
- valid_from
- valid_to

Relationships evolve.

---

# Episode

A significant sequence of graph evolution.

Examples

- Vegetation collapse
- Flood propagation
- Reservoir recovery
- Unknown anomaly

Properties

- id
- start_time
- end_time
- participating_entities
- trajectory
- outcome
- embedding

Episodes become long-term memory.

---

# Relationship Types

Static

- adjacent_to
- contains
- intersects
- upstream_of
- downstream_of

Dynamic

- influences
- propagates_to
- migrates_to
- correlated_with
- precedes
- follows

Learned

- similar_to
- analog_of
- precursor_of
- inferred_dependency

New relationship types may emerge automatically.

---

# State Evolution

```
Observation

↓

State(t)

↓

State(t+1)

↓

State(t+2)
```

States form immutable chains.

---

# Memory

The graph stores

Raw observations

↓

States

↓

Episodes

↓

Embeddings

Memory therefore becomes progressively more semantic.

---

# Query Philosophy

The graph should answer questions such as

What changed?

What is changing?

What usually changes next?

Where has this happened before?

Which trajectory is most similar?

What is likely to emerge?

Why?

---

# Design Rules

1. IDs never change.
2. Observations are append-only.
3. States are append-only.
4. Episodes are immutable.
5. Relationships are versioned.
6. Memory is cumulative.
7. Every object is explainable.
8. Every prediction is graph traceable.