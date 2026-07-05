# Climate Risk Framework

---

# Standard

Climate Risk Framework

---

# Organisation

Intergovernmental Panel on Climate Change (IPCC)

---

# Primary References

IPCC Fifth Assessment Report (AR5)

IPCC Sixth Assessment Report (AR6)

Working Group II

Impacts, Adaptation and Vulnerability

---

# Status

Primary climate risk reasoning framework adopted by Zoryn.

---

# Scope

The IPCC defines climate risk as the interaction between

- Hazard
- Exposure
- Vulnerability

rather than considering hazards alone.

This framework forms the conceptual foundation for environmental risk assessment throughout Zoryn.

---

# Core Principle

```
Risk

=

Hazard
×

Exposure
×

Vulnerability
```

A severe hazard does not necessarily produce high risk.

Likewise, highly vulnerable systems may experience substantial impacts from relatively modest hazards.

---

# Definitions

## Hazard

A physical event, trend, or environmental process that may cause adverse impacts.

Examples

- drought
- flood
- heatwave
- cyclone
- wildfire

---

## Exposure

People, ecosystems, infrastructure, agriculture, or assets located where hazards may occur.

Examples

- population
- roads
- hospitals
- cropland
- reservoirs

---

## Vulnerability

The susceptibility of exposed systems to harm.

Examples

- poor irrigation
- degraded ecosystems
- fragile infrastructure
- socioeconomic sensitivity

---

## Risk

The potential for adverse consequences arising from the interaction of

- Hazard
- Exposure
- Vulnerability

---

# Zoryn Reasoning Model

The reasoning engine follows the same progression.

```
Observation

↓

Evidence

↓

Pattern

↓

Hypothesis

↓

Hazard

↓

Risk

↓

Warning
```

Risk should never be inferred from hazard alone.

---

# Hazard Indicators

Examples

Meteorology

- SPI
- rainfall anomaly
- temperature anomaly

Hydrology

- runoff
- streamflow
- reservoir storage

Vegetation

- NDVI anomaly
- vegetation condition

Climate

- persistent extremes
- climate trends

---

# Exposure Indicators

Examples

- population
- settlements
- agriculture
- transport
- critical infrastructure

---

# Vulnerability Indicators

Examples

- poverty
- irrigation dependence
- ecosystem degradation
- water scarcity
- adaptive capacity

---

# Planned Pattern Rules

Examples

- PersistentDrynessRule
- HeatwavePersistenceRule
- FloodPersistenceRule
- VegetationStressRule

---

# Planned Hypotheses

Examples

- Developing Drought
- Increasing Flood Potential
- Escalating Heat Stress

---

# Planned Discoveries

Examples

- Persistent Meteorological Drought
- Emerging Agricultural Drought
- Elevated Flood Hazard

---

# Planned Warning Logic

Warnings should ultimately be generated from

```
Hazard

+

Exposure

+

Vulnerability
```

rather than hazard alone.

---

# Design Principles

The IPCC framework guides several architectural decisions.

- Hazard detection is separated from risk assessment.
- Environmental observations remain independent from socioeconomic indicators.
- Reasoning progresses through multiple evidence layers.
- Scientific traceability is maintained throughout the pipeline.

---

# Limitations

The IPCC framework describes concepts rather than implementation algorithms.

Specific thresholds and environmental reasoning should be implemented using complementary scientific standards.

---

# Traceability

Future Zoryn components expected to reference this framework include

Pattern Rules

- PersistentDrynessRule
- HeatwavePersistenceRule

Hypotheses

- Drought Development
- Flood Development

Discoveries

- Climate Risk Assessment

Warning Engine

- Hazard Assessment
- Risk Assessment

---

# References

IPCC.

Climate Change 2022.

Working Group II.

Impacts, Adaptation and Vulnerability.

Sixth Assessment Report (AR6).