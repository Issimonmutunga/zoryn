# Standardized Precipitation Index (SPI)

---

# Standard

Standardized Precipitation Index (SPI)

---

# Organisation

World Meteorological Organization (WMO)

---

# Publication

Standardized Precipitation Index User Guide

WMO-No. 1090

---

# Authors

Svoboda, M.
Hayes, M.
Wood, D.

National Drought Mitigation Center

---

# Publication Year

2012

---

# Status

Primary drought reference adopted by Zoryn.

---

# Scope

The Standardized Precipitation Index (SPI) is the internationally recognised meteorological drought index recommended by the World Meteorological Organization for monitoring precipitation anomalies across multiple accumulation periods.

SPI standardises accumulated precipitation relative to the historical climate distribution, allowing wet and dry conditions to be compared across regions and seasons.

---

# Environmental Domain

Meteorology

Climatology

Drought Monitoring

Early Warning

---

# Variables

Primary

- precipitation_amount

Derived

- SPI-1
- SPI-3
- SPI-6
- SPI-12
- SPI-24

---

# Time Scales

Typical accumulation periods include

| Scale | Typical Application |
|--------|---------------------|
| SPI-1 | Short-term rainfall anomalies |
| SPI-3 | Seasonal moisture conditions |
| SPI-6 | Medium-term drought |
| SPI-12 | Long-term drought |
| SPI-24 | Multi-year climate conditions |

---

# Standard Classification

| SPI | Classification |
|-----:|----------------|
| ≥ 2.00 | Extremely Wet |
| 1.50 to 1.99 | Very Wet |
| 1.00 to 1.49 | Moderately Wet |
| -0.99 to 0.99 | Near Normal |
| -1.00 to -1.49 | Moderate Drought |
| -1.50 to -1.99 | Severe Drought |
| ≤ -2.00 | Extreme Drought |

---

# Interpretation

Positive SPI values indicate wetter-than-normal conditions.

Negative SPI values indicate drier-than-normal conditions.

Values close to zero represent climatologically normal precipitation.

SPI represents precipitation anomalies only.

It does not account for

- temperature
- evapotranspiration
- soil moisture
- streamflow
- groundwater

Additional indicators are required for comprehensive drought assessment.

---

# Zoryn Implementation

Current implementation

- SPI-3
- SPI-6
- SPI-12

Implementation

- Monthly precipitation
- Gamma distribution
- Monthly climatology
- WMO methodology
- Climate-indices reference implementation validated

Validation

The implementation has been independently validated against the `climate_indices` reference library with negligible numerical differences across the pilot dataset.

---

# Planned Pattern Rules

Future reasoning rules derived from this standard include

- PersistentDrynessRule
- PersistentWetnessRule
- DroughtOnsetRule
- DroughtRecoveryRule
- MultiScaleDroughtRule
- FlashDroughtRule

---

# Planned Hypotheses

Examples include

- Developing Meteorological Drought
- Persistent Meteorological Drought
- Drought Recovery
- Exceptional Wet Conditions

---

# Planned Warnings

Examples include

- Moderate Drought Watch
- Severe Drought Warning
- Extreme Drought Emergency

---

# Limitations

SPI evaluates precipitation only.

SPI should not be interpreted as

- agricultural drought
- hydrological drought
- ecological drought

without additional supporting evidence.

---

# Traceability

The following Zoryn components should reference this standard.

Indices

- indices/spi.py

Pattern Rules

- PersistentDrynessRule
- PersistentWetnessRule
- DroughtOnsetRule
- DroughtRecoveryRule

Hypotheses

- Developing Meteorological Drought
- Persistent Meteorological Drought

Warnings

- Drought Watch
- Drought Warning

---

# References

Svoboda, M., Hayes, M., and Wood, D.

Standardized Precipitation Index User Guide.

World Meteorological Organization.

WMO-No. 1090.

2012.