<div align="center">

<img src="docs/assets/zoryn-logo.png" alt="Zoryn" width="140"/>

# Zoryn

### Environmental Intelligence Through Explainable Reasoning

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)]()
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

*Understanding environmental change through evidence, provenance and reasoning.*

</div>

---

## Overview

Zoryn is an environmental intelligence platform that analyzes historical environmental patterns, identifies similar signatures, and explains why a location is changing.

Instead of returning only predictions or scores, Zoryn provides transparent reasoning backed by evidence and complete provenance, enabling users to understand **what is happening, why it is happening, and what historical conditions it most closely resembles.**

---

## Features

- 🌍 Interactive H3-based environmental map
- 🧠 Signature-based environmental reasoning
- 🔎 Explainable AI with evidence and provenance
- 📚 Knowledge graph driven analysis
- 📈 Multi-temporal environmental pattern comparison
- ⚡ Fast API for environmental reasoning
- 🛰️ Built on open Earth observation datasets

---

## How It Works

```text
Environmental Data
        │
        ▼
Knowledge Graph
        │
        ▼
Signature Retrieval
        │
        ▼
Reasoning Engine
        │
        ▼
Evidence & Provenance
        │
        ▼
Explainable Insights
```

---

## Technology Stack

### Backend

- Python
- FastAPI
- DuckDB
- Apache Parquet
- Polars
- NumPy

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- TanStack Query
- MapLibre GL JS

### Geospatial

- Google Earth Engine
- H3
- GeoPandas
- Rasterio
- Shapely

### AI & Reasoning

- TinyLlama
- llama.cpp
- Knowledge Graph
- Explainable AI (XAI)

---

## Project Structure

```text
backend/
frontend/
data/
docs/
tests/
```

---

## Getting Started

### Clone

```bash
git clone https://github.com/Issimonmutunga/zoryn.git

cd zoryn
```

### Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Demo

**Live Demo**

> https://youtu.be/W6VMQSRtY4w

---

## Screenshots

### Interactive Environmental Map

<p align="center">
  <img src="docs/images/08-map-layers.png" alt="Interactive Environmental Map" width="100%">
</p>

Explore environmental indicators through an interactive H3-based map with configurable data layers.

### Explainable AI Reasoning

<p align="center">
  <img src="docs/images/05-ai-explanation.png" alt="Explainable AI Reasoning" width="100%">
</p>

Every environmental insight is accompanied by transparent reasoning, supporting evidence, and complete provenance.

---

## Vision

Zoryn is evolving into a live environmental intelligence system capable of continuously ingesting environmental observations, relating them to historical events, and producing transparent, explainable early warning insights.

The long-term goal is to combine:

- Environmental signatures
- Historical analogues
- Susceptibility analysis
- Multi-criteria reasoning
- Knowledge graph intelligence

to support better environmental decision-making.

---

## Built With

- Python
- FastAPI
- React
- TypeScript
- Google Earth Engine
- H3
- DuckDB
- Apache Parquet
- Polars
- GeoPandas
- MapLibre GL JS
- Zustand
- TinyLlama
- llama.cpp

---

## Contributing

Contributions, ideas and discussions are welcome.

---

## License

MIT License.