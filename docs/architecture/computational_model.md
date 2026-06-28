# Computational Model

## Philosophy

Zoryn does not model hazards.

Zoryn models the evolution of Earth's state.

Hazards, impacts, and risks emerge from that evolution.

---

# The Earth State

At any instant, the Earth is represented as

G(t)

where

- G is the complete Temporal Earth Knowledge Graph
- t is time

The graph itself is the system state.

---

# Evolution

The engine learns the transformation

G(t) → G(t+Δ)

rather than

Weather → Flood

or

Rainfall → Drought

Its objective is to predict the next graph state.

---

# Observations

Observations provide evidence.

They never directly become predictions.

Instead

Observations

↓

State Update

↓

Graph Update

↓

Knowledge Update

↓

Prediction

---

# Learning Objective

Learn

"What normally changes next?"

rather than

"Does drought occur?"

---

# Memory

Memory stores

- trajectories
- transitions
- relationships
- episodes
- embeddings

Memory is cumulative.

---

# Prediction

Prediction estimates

P(G(t+Δ) | G(t))

rather than

P(Hazard)

Hazards are interpreted from predicted graph states.

---

# Discovery

Novelty is measured in graph space.

A trajectory is considered novel when it significantly departs from previously observed evolution.

Novel trajectories become candidates for new precursor signatures.

---

# Explainability

Every prediction should identify

- contributing entities
- contributing relationships
- supporting episodes
- uncertainty
- confidence

Every result must be traceable through graph evolution.

---

# Continual Learning

Knowledge evolves through

Observation

↓

State

↓

Graph

↓

Memory

↓

Prediction

↓

Observation

The cycle never ends.

---

# Design Principles

1. The graph is the prediction target.
2. Learning is self-supervised whenever possible.
3. History is append-only.
4. Knowledge accumulates.
5. Models are replaceable.
6. Memory persists.
7. Predictions are explainable.
8. Unknown patterns are discoverable.