# Time Model

## Philosophy

Time is not an attribute.

Time is part of the graph.

A node is never represented by a single snapshot.

Instead, every entity exists as an evolving sequence of states connected through time.

---

# State Chain

Each entity forms a temporal chain.

```
H3 Cell

State(t-2)
      │
      ▼
State(t-1)
      │
      ▼
 State(t)
      │
      ▼
State(t+1)
```

A state never changes once created.

Future observations create new states.

---

# Temporal Edges

Every state is connected to:

- Previous state
- Next state

These are explicit graph edges.

Time therefore becomes navigable.

---

# Multiple Time Scales

The graph supports multiple temporal resolutions simultaneously.

Examples

- Minutes
- Hours
- Days
- Weeks
- Months
- Seasons
- Years

These are views of the same history.

---

# Temporal Neighborhood

A neighborhood is no longer only spatial.

For a state, neighbors include:

- Adjacent H3 cells
- Upstream/downstream cells
- Previous states
- Future forecast states
- Similar historical trajectories

Reasoning therefore occurs in space and time simultaneously.

---

# Branching Futures

Observed history is linear.

Forecasts are branches.

```
Observed

t0 → t1 → t2 → t3

                 ├── Forecast A
                 ├── Forecast B
                 └── Forecast C
```

Each branch stores:

- probability
- confidence
- assumptions

Observed history is never overwritten.

---

# Temporal Memory

The graph stores:

- Recent states in full detail.
- Older states as compressed embeddings.
- Significant transitions as permanent episodes.

The graph remembers transitions rather than only values.

---

# Temporal Similarity

Prediction is based on trajectory similarity.

Instead of asking:

"What is today's rainfall?"

The graph asks:

"Which historical trajectories most closely resemble the evolution occurring now?"

---

# Design Rules

1. Time is represented by graph edges.
2. States are immutable.
3. History is append-only.
4. Forecasts create branches.
5. Memory compresses history without losing trajectories.
6. Similarity is measured between trajectories, not snapshots.
7. Spatial and temporal reasoning are inseparable.