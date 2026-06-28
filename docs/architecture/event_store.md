# Event Store

## Philosophy

The Event Store is the immutable ledger of everything Zoryn has ever observed.

Nothing is ever updated.

Nothing is ever deleted.

Everything is appended.

The Event Store is the foundation from which the entire Living Earth Graph can be reconstructed.

---

# What is an Event?

An event is a recorded fact.

Examples

* A rainfall observation arrived.
* A new satellite image was processed.
* A river level changed.
* A graph relationship was discovered.
* A forecast was generated.
* A hypothesis was created.
* A prediction was verified.

Events describe things that happened.

They never change.

---

# Event Categories

Observation Events

State Events

Relationship Events

Episode Events

Memory Events

Forecast Events

Hypothesis Events

System Events

---

# Event Structure

Every event contains

* event_id
* event_type
* event_time
* recorded_time
* source
* entity
* payload
* metadata

The payload depends on the event type.

---

# Event Ordering

Two timestamps exist.

**event_time**

When the event actually occurred.

**recorded_time**

When Zoryn learned about it.

Late-arriving observations are therefore supported.

---

# Event Log

The event log is append-only.

```text
Event 1

↓

Event 2

↓

Event 3

↓

...

↓

Event N
```

History never changes.

---

# Replay

The Living Earth Graph is reconstructed by replaying events.

```text
Observation

↓

State Update

↓

Relationship Update

↓

Memory Update

↓

Prediction
```

If required, the entire graph can be rebuilt from the first event.

---

# Advantages

* Complete provenance.
* Perfect reproducibility.
* Easy debugging.
* Incremental computation.
* Distributed processing.
* Future-proof architecture.

---

# Design Rules

1. Events are immutable.
2. Events are append-only.
3. Events are timestamped.
4. Replay must produce identical graph state.
5. Every higher layer is derived from events.
6. Nothing bypasses the Event Store.

---

# Architectural Principle

The Event Store is the source of truth.

The Living Earth Graph is the current interpretation of that truth.

This separation allows the graph to be rebuilt, audited, or improved as algorithms evolve while preserving the complete historical record.
