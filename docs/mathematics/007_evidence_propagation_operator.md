# Evidence Propagation Operator

## Purpose

This document defines the Evidence Propagation Operator.

The operator describes how newly acquired evidence modifies scientific understanding throughout the Dynamic Process Network.

Every reasoning algorithm within Zoryn is ultimately an implementation of this operator.

---

# Definitions

## Definition 1 — Dynamic Process Network

Let

D = (P, I)

where

P

is the set of processes,

and

I

is the set of interactions.

---

## Definition 2 — Evidence Field

Each process

p ∈ P

possesses an accumulated evidence value

E(p)

The collection of all evidence values forms the Evidence Field

ℰ

over the Dynamic Process Network.

---

## Definition 3 — Incoming Evidence

Suppose

δE

represents newly validated evidence arriving from a new fact.

This evidence initially belongs to one process.

Propagation distributes its influence.

---

# Operator Definition

Define the Evidence Propagation Operator

ℙ

such that

ℙ : ℰₜ → ℰₜ₊₁

The operator transforms one evidence field into another.

Historical evidence is preserved.

Only accumulated support evolves.

---

# Locality

Propagation begins locally.

New evidence first modifies

the originating process,

before influencing neighbouring processes.

---

# Axiom 1 — Local Conservation

The originating process always receives the largest evidence update.

Neighbouring processes receive propagated evidence.

Propagation therefore decreases with network distance.

---

# Axiom 2 — Provenance Preservation

Propagation never destroys provenance.

Every propagated quantity remains traceable to its originating facts.

---

# Axiom 3 — Historical Preservation

Propagation never modifies historical facts.

Only accumulated evidence changes.

Scientific history is immutable.

---

# Axiom 4 — Monotonic Learning

Supporting evidence never decreases supporting evidence.

Contradictory evidence is accumulated separately.

Learning remains explicit.

---

# Propagation Function

Suppose

N(p)

represents neighbouring processes.

Then

ℙ(E(p))

depends upon

Local Evidence

Neighbour Evidence

Interaction Strength

Interaction Confidence

Propagation Distance

Evidence Quality

No implementation-specific equation is imposed.

Only these dependencies are required.

---

# Propagation Radius

Evidence does not necessarily propagate globally.

Propagation naturally weakens with

network distance,

temporal separation,

and interaction uncertainty.

Local evidence therefore dominates.

---

# Multiple Paths

Evidence may reach the same process through multiple independent paths.

Independent paths reinforce confidence.

Repeated identical paths contribute progressively less new evidence.

---

# Feedback

Propagation may revisit previously updated processes.

Feedback is permitted.

Circular self-reinforcement without independent evidence is prohibited.

---

# Convergence

Repeated propagation should converge.

As new evidence diminishes,

the Evidence Field approaches stability.

Stable evidence remains revisable.

---

# Computational Interpretation

Each arriving fact performs

        Validation

            ↓

       Local Update

            ↓

        Propagation

            ↓

     Confidence Update

            ↓

       Theory Revision

            ↓

      Forecast Revision

The operator therefore forms the computational heartbeat of Zoryn.

---

# Properties

The Evidence Propagation Operator satisfies

Locality

Traceability

Reproducibility

Monotonicity

Bounded Influence

Continuous Revision

---

# Scientific Basis

This document builds upon concepts from

Graph Signal Processing

Belief Propagation

Bayesian Networks

Network Science

Distributed Dynamical Systems

while introducing continual scientific evidence propagation over Dynamic Process Networks.

---

# Open Questions

* What propagation kernel best represents Earth systems?
* Should propagation be deterministic or probabilistic?
* How should evidence decay with network distance?
* How should propagation interact with theory revision?

---

# Zoryn Contribution

The Evidence Propagation Operator defines continual scientific learning as the propagation of evidence across an evolving Dynamic Process Network rather than the propagation of predictions or messages.

This operator forms the fundamental computational primitive upon which reasoning, forecasting and theory formation are built.
