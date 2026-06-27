# Zoryn System Architecture

```text
                                       OBSERVATIONS
        ┌────────────────────────────────────────────────────────────┐
        │ Satellite │ Weather │ Sensors │ Models │ Human Reports │ IoT │
        └────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                          INGESTION LAYER
                                   │
                                   ▼
                     NORMALIZATION & STANDARDIZATION
                                   │
                                   ▼
                        SPATIOTEMPORAL INDEXING
                           (H3 + Time Dimension)
                                   │
                                   ▼
               ┌────────────────────────────────────┐
               │   TEMPORAL EARTH KNOWLEDGE GRAPH    │
               │                                    │
               │  Nodes : H3 Cells                 │
               │  Edges : Spatial                 │
               │          Hydrological            │
               │          Atmospheric             │
               │          Ecological              │
               │          Human                   │
               │          Temporal                │
               └────────────────────────────────────┘
                          │                │
            ┌─────────────┘                └─────────────┐
            ▼                                            ▼
      GRAPH MEMORY                              GRAPH EVOLUTION
(Long-term knowledge)                   (Continuous graph updates)

            │                                            │
            └──────────────────┬─────────────────────────┘
                               ▼
                     EMBEDDING REPRESENTATION
                               │
                               ▼
                  SELF-SUPERVISED REPRESENTATION
                          LEARNING ENGINE
                               │
                               ▼
                   GRAPH REASONING & INFERENCE
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
      Pattern Discovery   Forecasting     Explainability
             │                 │                 │
             └─────────────────┼─────────────────┘
                               ▼
                    EARLY WARNING GENERATION
                               │
                               ▼
                       APIs • CLI • Dashboard
```

---

## Core Design Philosophy

The knowledge graph is the product.

Everything else exists to improve, update, query, or reason over the graph.

Machine learning is treated as a capability—not the core architecture.

Knowledge accumulates continuously.

Models may be replaced.

The graph persists.

---

## Design Principles

1. Earth is represented as a living graph.
2. Time is a first-class dimension.
3. Knowledge evolves continuously.
4. Learning is predominantly self-supervised.
5. Hazard definitions are optional.
6. Unknown precursor patterns are discoverable.
7. Every prediction should be explainable.
8. Every component should be independently replaceable.