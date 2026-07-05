# Vegetation Monitoring and Crop Condition

---

# Standard

Vegetation Monitoring

Crop Condition Assessment

---

# Organisation

Food and Agriculture Organization of the United Nations (FAO)

---

# Primary References

FAO Agricultural Stress Index System (ASIS)

FAO Remote Sensing for Agriculture

FAO Drought Monitoring Guidance

---

# Status

Primary vegetation monitoring reference adopted by Zoryn.

---

# Scope

This document defines the principles used by Zoryn to monitor vegetation
condition and identify environmental stress affecting crops and natural
ecosystems.

Vegetation is one of the earliest observable indicators of developing
agricultural drought.

---

# Environmental Domain

Agriculture

Vegetation

Food Security

Drought Monitoring

---

# Core Principle

Vegetation condition reflects the cumulative effects of environmental
conditions rather than individual weather events.

Persistent environmental stress is more important than isolated anomalies.

---

# Primary Drivers

Examples include

- rainfall
- soil moisture
- evapotranspiration
- temperature
- solar radiation

Vegetation integrates these influences over time.

---

# Common Indicators

Remote sensing

- NDVI
- EVI
- FAPAR
- LAI

Derived indices

- Vegetation Condition Index (VCI)
- Vegetation Health Index (VHI)
- Agricultural Stress Index (ASI)

---

# Environmental Behaviour

Typical sequence

```
              Normal Rainfall

                    ↓

              Reduced Rainfall

                   ↓

            Lower Soil Moisture

                   ↓

           Reduced Vegetation Growth

                   ↓ 

            Vegetation Stress

                   ↓

              Crop Stress

                   ↓

          Agricultural Drought
```

---

# Pattern Characteristics

Vegetation stress is generally

- persistent
- spatially coherent
- seasonal
- cumulative

It should not be inferred from a single observation.

---

# Planned Pattern Rules

Examples

PersistentVegetationStressRule

VegetationRecoveryRule

SeasonalVegetationDeclineRule

CropStressRule

---

# Planned Hypotheses

Examples

Developing Agricultural Drought

Crop Moisture Stress

Delayed Vegetation Recovery

Reduced Biomass Production

---

# Planned Warning Logic

Agricultural drought warnings should combine

Meteorology

+

Vegetation

+

Water Availability

rather than relying on a single vegetation indicator.

---

# Design Principles

Vegetation should be interpreted as a response to environmental forcing.

Vegetation observations provide evidence of ecosystem condition rather than
the direct cause of environmental change.

---

# Limitations

Vegetation condition may also be influenced by

- agricultural management
- irrigation
- pests
- fire
- land use change

Environmental reasoning should therefore combine vegetation with additional
supporting evidence.

---

# Traceability

Future Zoryn components expected to reference this standard include

Pattern Rules

- PersistentVegetationStressRule
- VegetationRecoveryRule
- CropStressRule

Hypotheses

- Agricultural Drought
- Vegetation Recovery
- Ecosystem Stress

Warnings

- Agricultural Drought Watch
- Crop Stress Advisory

---

# References

Food and Agriculture Organization of the United Nations.

Agricultural Stress Index System (ASIS).

Remote Sensing for Agriculture.

Drought Monitoring Guidance.