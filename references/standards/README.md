# Scientific Standards

This directory contains the scientific standards that govern how Zoryn reasons about environmental observations.

Unlike many rule-based systems, Zoryn is designed so that every environmental rule can be traced to an accepted scientific methodology whenever one exists.

These documents are implementation references, not copies of the original publications.

---

# Objectives

The standards library serves five purposes.

1. Document the scientific basis of every reasoning rule.

2. Record implementation decisions made by Zoryn.

3. Make the reasoning engine transparent and auditable.

4. Ensure future contributors implement rules consistently.

5. Provide traceability from warnings back to recognised scientific guidance.

---

# Directory Structure

```
standards/

├── README.md
├── glossary.md

├── wmo/
├── ipcc/
├── fao/
├── usgs/
├── undrr/
├── noaa/

└── ...
```

Each organisation has its own directory.

As additional standards are adopted, they should be added beneath the relevant organisation.

---

# Standard Document Template

Every standard document should contain the following sections.

```
Source
Scope
Variables
Applicable Hazards
Implemented Rules
Implemented Thresholds
Implementation Notes
Limitations
Future Rules
References
```

Maintaining a consistent structure makes the standards library easy to navigate and simplifies future audits.

---

# Rule Traceability

Every PatternRule should reference one or more standards.

Example

```
PersistentDrynessRule

↓

Reference

WMO SPI User Guide
```

Likewise, every Hypothesis and Warning should record the standards that support the reasoning process.

---

# Implementation Philosophy

Scientific standards should describe environmental behaviour.

PatternRules should implement those behaviours.

The reasoning engine should never invent thresholds or classifications when recognised scientific guidance already exists.

Where no formal standard exists, peer-reviewed literature should be preferred over arbitrary heuristics.

---

# Versioning

Standards evolve.

If a newer edition of a standard changes thresholds or methodology, the corresponding rule should reference the edition that it implements.

Historical implementations should remain reproducible.

---

# Scope

This library is intended to support all environmental domains represented by Zoryn, including:

- Meteorology
- Climatology
- Hydrology
- Agriculture
- Vegetation
- Wildfire
- Heat
- Water Security
- Multi-hazard Early Warning

Additional domains may be added as Zoryn evolves.