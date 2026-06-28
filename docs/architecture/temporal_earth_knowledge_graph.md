# Temporal Earth Knowledge Graph (TEKG)

## Purpose

The Temporal Earth Knowledge Graph (TEKG) is Zoryn's core data structure.

Rather than storing observations independently, TEKG represents the Earth as a continuously evolving graph whose knowledge accumulates over time.

Everything in Zoryn reads from or writes to the TEKG.

---

# Graph Structure

The graph consists of:

- Nodes
- Edges
- States
- Observations
- Time

---

# Nodes

Nodes represent persistent entities.

Examples include:

- H3 cells
- Rivers
- Lakes
- Reservoirs
- Forests
- Roads
- Settlements
- Administrative regions
- Sensors
- Weather stations

Nodes do not disappear.

Their state changes.

---

# Edges

Edges represent relationships.

Relationships may be

- Spatial adjacency
- River connectivity
- Groundwater flow
- Atmospheric transport
- Human mobility
- Infrastructure
- Ecological interaction
- Statistical dependency
- Learned dependency

Edges may change over time.

---

# Observations

Observations are immutable measurements.

Examples

- Rainfall
- NDVI
- Temperature
- Wind
- Water level

Observations never change once recorded.

---

# States

Each node owns a timeline of states.

Example

H3 Cell A

2020-01

↓

2020-02

↓

2020-03

↓

...

A state summarizes all knowledge known about the node at that instant.

---

# Time

Time is a first-class graph dimension.

It is not merely a node attribute.

Every edge and node may evolve through time.

This allows reasoning over trajectories rather than snapshots.

---

# Memory

Historical graph evolution is compressed into learned representations.

Raw observations remain archived.

Memory continually improves as new observations arrive.

---

# Graph Evolution

New observations never overwrite history.

Instead they produce

Old State

↓

New Observation

↓

Updated State

↓

Updated Graph

↓

Updated Memory

History is preserved.

Knowledge accumulates.

---

# Forecasting

Forecasting predicts future graph states.

Hazards are inferred from graph evolution.

The graph is the prediction target.

Not drought.

Not flood.

Not wildfire.

The future graph itself.

---

# Discovery

Previously unknown graph trajectories are continuously searched.

Novel trajectories become candidate precursor signatures.

Discovery is continuous.

---

# Explainability

Every prediction should answer

- What changed?
- Where?
- When?
- Why?
- Which historical trajectories are similar?

Predictions are graph-traceable.

---

# Design Rules

1. Nothing bypasses the graph.
2. Observations are immutable.
3. States evolve.
4. Memory accumulates.
5. History is never destroyed.
6. Learning is continual.
7. Hazards are emergent.
8. Every prediction is explainable.