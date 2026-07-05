# Zoryn References

This directory contains the scientific and technical references used to design, implement, and validate Zoryn.

The purpose of this library is to ensure every reasoning component can be traced to an accepted scientific, engineering, or international standard.

The reference library is organised by source rather than by hazard. This keeps documentation maintainable as the project grows.

## Structure

```
references/
├── README.md
├── bib/
├── books/
├── datasets/
├── papers/
└── standards/
```

## Categories

### Standards

International standards, operational guidance, and official methodologies.

Examples:

- World Meteorological Organization (WMO)
- Intergovernmental Panel on Climate Change (IPCC)
- Food and Agriculture Organization (FAO)
- United States Geological Survey (USGS)
- United Nations Office for Disaster Risk Reduction (UNDRR)
- National Oceanic and Atmospheric Administration (NOAA)

These documents form the scientific basis for PatternRules, hypotheses, and warning generation.

### Papers

Peer-reviewed scientific publications used where formal standards do not exist.

### Datasets

Documentation describing datasets used by Zoryn, including their assumptions, limitations, spatial resolution, temporal resolution, and recommended applications.

### Books

Reference textbooks that provide theoretical background for environmental reasoning.

### Bibliography

BibTeX references used throughout the project.

---

# Design Philosophy

Every reasoning component in Zoryn should answer three questions:

1. What conclusion was reached?
2. What evidence supports the conclusion?
3. Which scientific standard or publication justifies the reasoning?

Reasoning without scientific justification is not sufficient for an operational environmental intelligence system.

Accordingly, every future PatternRule, Hypothesis, Discovery, and Warning should reference one or more documents contained within this library.

The goal is to make Zoryn transparent, explainable, reproducible, and scientifically defensible.