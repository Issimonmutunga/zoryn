# Canonical Data Model

## Philosophy

The data model represents facts, not implementations.

Whether the backend is Parquet, DuckDB, PostgreSQL, Neo4j, or another system, the logical model remains unchanged.

---

# Storage Layers

The engine stores information in five logical layers.

```
Observations

↓

States

↓

Relationships

↓

Episodes

↓

Memory
```

Each layer builds upon the previous one.

---

# Layer 1 — Observations

Purpose

Store immutable measurements.

Characteristics

- Append only
- Timestamped
- Source attributed
- Never modified

---

# Layer 2 — States

Purpose

Represent the condition of an entity at a point in time.

Characteristics

- Immutable
- Derived from observations
- Linked to previous state
- Linked to next state

States form temporal chains.

---

# Layer 3 — Relationships

Purpose

Represent interactions.

Relationships connect

- Entity → Entity
- State → State
- Episode → Episode

Relationships may change over time.

---

# Layer 4 — Episodes

Purpose

Store meaningful sequences of evolution.

Episodes describe

- transitions
- recoveries
- anomalies
- propagations
- recurring behaviours

Episodes become reusable knowledge.

---

# Layer 5 — Memory

Purpose

Store compressed knowledge.

Memory contains

- embeddings
- trajectory summaries
- learned dependencies
- analogues
- long-term statistics

Memory accelerates reasoning.

---

# Data Flow

```
Observation

↓

State

↓

Relationship Update

↓

Episode Detection

↓

Memory Update

↓

Forecast
```

The flow is strictly one direction.

History is never rewritten.

---

# Versioning

Every object has

- identifier
- version
- created_at

Objects are never updated in place.

New knowledge creates new versions.

---

# Partitioning

Data should be partitioned by

- time
- spatial region
- entity type

This allows incremental computation.

---

# Compression

Raw observations remain archived.

Older states may be compressed.

Episodes remain permanent.

Memory continuously evolves.

Compression must never destroy provenance.

---

# Provenance

Every prediction must be traceable back to

Observation

↓

State

↓

Relationship

↓

Episode

↓

Memory

↓

Prediction

Every conclusion must be reproducible.

---

# Design Rules

1. Facts are immutable.
2. Knowledge is append-only.
3. Relationships are versioned.
4. Provenance is mandatory.
5. Storage is implementation-independent.
6. Computation should be incremental.
7. Every layer can be rebuilt from lower layers.
8. Memory is derived, never authoritative.