# Dynamic Process Network

## Purpose

This document defines the Dynamic Process Network (DPN), the primary mathematical object within Zoryn.

The DPN represents the continually evolving scientific understanding of interacting Earth systems.

All computational operations within Zoryn operate on the DPN.

---

# Definitions

## Definition 1 — Dynamic Process Network

A Dynamic Process Network is an ordered mathematical structure

D = (S, P, I, F, T)

where

S

is the set of systems.

P

is the set of processes.

I

is the set of interactions.

F

is the set of facts.

T

is the temporal domain.

---

## Definition 2 — System

A system

s ∈ S

is a bounded scientific object whose behaviour evolves through time.

Systems may exist at any spatial or temporal scale.

---

## Definition 3 — Process

A process

p ∈ P

is a mechanism that transforms one or more system states through time.

Processes operate on systems.

Processes generate observable change.

---

## Definition 4 — Interaction

An interaction

i ∈ I

describes how one process influences another.

Interactions are directed.

Interactions evolve.

Interactions possess evidence.

---

## Definition 5 — Fact

A fact

f ∈ F

is an immutable observation describing one or more systems at a particular time.

Facts never change.

Facts provide evidence.

---

# State Function

Every system possesses state.

Define

σ

such that

σ : S × T → X

where

X

represents the state space.

The function returns the state of any system at any time.

---

# Process Function

Every process transforms states.

Define

π

such that

π : X → X

Processes therefore operate as state-transition mappings.

---

# Interaction Function

Interactions modify processes.

Define

ι

such that

ι : P × P → ℝ

The interaction function quantifies influence between processes.

Positive values indicate reinforcement.

Negative values indicate suppression.

Zero indicates no known interaction.

---

# Observation Function

Facts observe systems.

Define

φ

such that

φ : S × T → F

Observations generate immutable facts.

---

# Evidence Function

Evidence is accumulated from facts.

Define

ε

such that

ε : F → ℰ

where

ℰ

is the evidence space.

Evidence evolves.

Facts do not.

---

# Confidence Function

Confidence depends upon evidence.

Define

γ

such that

γ : ℰ → [0,1]

Confidence therefore emerges from evidence.

---

# Forecast Function

Forecasts project future states.

Define

ψ

such that

ψ : D × T → X

Forecasts operate upon the entire Dynamic Process Network.

---

# Evolution

The Dynamic Process Network evolves continuously.

At every observation

                     Dₜ

                     ↓

                 New Facts

                     ↓

              Evidence Update

                     ↓

             Confidence Update

                     ↓

               Theory Revision

                     ↓

                    Dₜ₊₁

The mathematical object evolves.

Historical states remain recoverable.

---

# Invariants

The Dynamic Process Network satisfies

Fact Immutability

Evidence Traceability

Historical Preservation

Scientific Reproducibility

Continuous Evolution

These properties are invariant.

---

# Computational Interpretation

The Dynamic Process Network is not a graph.

It is a continuously evolving scientific object.

Graphs,

knowledge bases,

forecasts,

and explanations

are projections of the Dynamic Process Network.

---

# Scientific Basis

This document builds upon

Systems Theory

Graph Theory

Dynamical Systems

Category Theory

Earth System Science

while introducing the Dynamic Process Network as a unified mathematical representation of continually evolving scientific understanding.

---

# Open Questions

* Should interactions themselves possess state?
* Should processes operate on multiple state spaces?
* How should uncertainty propagate through mappings?
* Can multiple Dynamic Process Networks coexist?

---

# Zoryn Contribution

The Dynamic Process Network unifies systems, processes, interactions, observations and scientific understanding within a single evolving mathematical object.

Rather than representing static relationships, it represents the continual evolution of scientific knowledge about the Earth through immutable facts, evolving evidence and adaptive process models.
