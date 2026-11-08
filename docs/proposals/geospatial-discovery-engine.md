# Proposal: Zoryn Geospatial Discovery Engine

Status: **draft for review — no existing code has been modified.**
Scope: architectural investigation, integration strategy, first experiment, and a commercial wedge.

---

## 1. What I found (current architecture)

### 1.1 Shape of the codebase

| Layer | Where | Notes |
|---|---|---|
| Ingestion / canonical observations | `src/zoryn/ingestion`, `knowledge/store.py` | `ObservationStore` enforces exactly `(timestamp, h3_id, variable, value, source)`. |
| Reasoning chain | `src/zoryn/knowledge/*` | `Signature → Relationship → Evidence → Pattern → Hypothesis → Discovery`, all frozen dataclasses. Orchestrated by `KnowledgeEngine.run()`. |
| Persistence | `src/zoryn/persistence/*` | Immutable records → `KnowledgeBundle` → partitioned Parquet batches (`data/processed/knowledge/<table>/*.parquet`), deduped by sha256-style ids. |
| API | `src/zoryn/rest/*` | FastAPI, read-only over Parquet via Polars. Routes: discoveries, reasoning, explanation, map geometry/SPI, hypothesis, patterns, evidence, history. |
| Explanation | `src/zoryn/explanation/*` | LLM (Groq provider) is handed a deterministic context and told to explain only. This is the right pattern to keep. |
| Frontend | `frontend/src` | React 18 + Vite + Zustand + TanStack Query + MapLibre. Pages: Home, Explorer, Methodology, Standards, About. Rich `components/reasoning/*` card set. |

### 1.2 The pilot data is much smaller than it looks

From the notebook outputs:

- 42,319 H3 res-10 cells over Nairobi County × 276 months = 11.68 M rows.
- But the source raster is CHIRPS at **10 × 6 pixels** (≈5 km). So the pilot holds roughly **60 independent precipitation series**, copied onto 42 k cells, and **one variable**.
- Any statistical test that treats 42 k cells as independent is pseudo-replicated. This matters for experiment design (§5): the precipitation data cannot validate embedding relationships on its own.

### 1.3 Structural observations that shape the design

1. **All reasoning is intra-cell.** `ReplayEngine` replays "histories independently for each H3 cell". `Relationship` means *transition between two Signatures of the same cell*. Nothing in the system compares one place to another. That is the gap the discovery engine fills, and it is why this can be added without disturbing the existing chain.
2. **Naming collision.** The user-facing word "relationship" already means "temporal transition" in code. A cell-to-cell link needs a different type name (proposed: `Association`; shown as "Relationship" in the UI).
3. **There is already a lifecycle scaffold, and it is dead.** `KnowledgeUnit` / `KnowledgeStatus` (candidate, validated, weakening, retired) / `KnowledgeValidator` (fixed ±0.1 confidence) is a precursor of the four-state model. It is not wired into `KnowledgeEngine`, and `knowledge/lifecycle.py` imports `KnowledgeDiscovery`, which does not exist in `knowledge/discovery.py` (that file defines `Discovery`). So `lifecycle.py` cannot be imported today. I will not reuse it; I will note it as the conceptual ancestor and leave it alone.
4. **`Hypothesis` is hazard-specific.** It requires `Pattern` objects carrying `metadata["h3_id"]`, and `HypothesisEngine` maps only `persistent_dryness`. Hypotheses about two places cannot be expressed in it without distortion.
5. **Persistence convention is append-only Parquet with Polars.** That convention fits an event-sourced relationship ledger well.
6. **Housekeeping noted, not changed:** README describes a `backend/` folder that doesn't exist (code is `src/zoryn`); README lists DuckDB but it isn't in dependencies; `requirements.txt` is UTF-16 encoded.

### 1.4 Latent Earth: what it really is

I opened `le.simonmapper.co.ke` and read its bundle.

- It is a **fully client-side lab**. No Zoryn-reusable backend, store or API exists. There is no embedding database to query.
- It calls Earth Engine from the browser with the *viewer's own* Google OAuth token and EE project (`GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL`, `sampleRegions`). Its own text says EE is free for noncommercial research only, and the bundle links to Earth Engine commercial terms.
- Its concepts (sample → cluster → similarity → targets) are exactly the discovery primitives we need, but as interactive exploration, not as persistent, auditable knowledge.

**Consequences:**
- "Reuse Latent Earth" means reusing its *methods and UX ideas* (and possibly extracting its clustering/similarity code into a shared package), not its data service.
- A paid service must not depend on a noncommercial EE quota. The commercial-safe route is the public cloud-optimised GeoTIFF mirror of AlphaEarth (see §3).

---

## 2. Concept model: keep five things distinct

```
Observation  ── measured value (CHIRPS, SPI, NDVI ...)       [exists]
Representation ─ model-derived vector (AEF 64-d, TESSERA 128-d) [new, separate table]
Association  ── candidate link between two Subjects          [new]
AssociationEvidence ─ supporting / contradicting test result [new]
Hypothesis   ── interpretive claim built on Established associations [later, extends existing]
```

- **Subject** = `(h3_id, time window)`. H3 res-10 cells (~15,000 m²) hold ~150 AlphaEarth 10 m pixels, so the existing grid aggregates embeddings naturally. No new spatial index.
- A Representation is **never** an Observation. It has no physical unit and is only comparable within one `(model, version, year)` space.

### 2.1 Two orthogonal axes on every Association

**State** (lifecycle, as requested): `dormant → emerging → established`, or `invalidated`. Transitions can go backwards (an Established link can be demoted, an Invalidated one stays as a tombstone with reason so it isn't blindly re-proposed).

**Claim level** (what is actually being claimed):

| Level | Meaning | Who can assign |
|---|---|---|
| `similarity` | Vectors are close | automatic |
| `association` | Co-varies in **held-out** data and survives a spatial null | automatic, per pre-declared test |
| `causal_candidate` | A named mechanism exists in the rule library, or a natural experiment is identified | rule library or human only |

Embedding similarity alone can reach **at most** `similarity`. "Established" always carries its level, so "Established similarity" and "Established causation" can never be confused. This enforces the requirement that embedding similarity is never read as causation.

### 2.2 Event-sourced registry (memory)

State is not stored; it is **folded** from an append-only ledger:

```
association        id, subject_a, subject_b, created_at, generator_id, params_hash, seed, code_sha
association_event  id, association_id, ts, kind (proposed|reevaluated|promoted|demoted|invalidated),
                   score_before, score_after, trigger, evidence_ids[]
association_evidence id, association_id, kind (supporting|contradicting|neutral), test_id,
                   statistic, null_statistic, representation_ids[], observation_ids[]
reeval_condition   association_id, predicate (machine-readable), last_checked
representation     h3_id, model, model_version, year, dim, vector, n_pixels, masked_frac,
                   source_uri, source_etag, aggregation, retrieved_at
```

Same Parquet-partition + id-dedup convention as `KnowledgeRepository`. Dormant candidates are never deleted; they carry `reeval_condition`s such as "new embedding year for either cell", "new variable observed in the neighbourhood", "a new labelled point within k neighbours".

### 2.3 Deterministic resolution

Each state change is a pure function of `(ledger so far, new data, versioned config)`:

- Evidence is accumulated as a log-likelihood-ratio against a null (spatial-block permutation null for similarity; stable-land control pairs for temporal drift). Thresholds `θ_emerge`, `θ_establish`, `θ_invalidate` live in versioned config.
- `established` additionally requires **criteria, not just a score**: ≥2 independent evidence kinds, ≥2 distinct years, passes the spatial null, and no unresolved contradiction.
- Re-running the same config on the same inputs must reproduce the same ledger (tested).
- The existing `KnowledgeValidator` ±0.1 rule is deliberately **not** used; a fixed increment has no statistical meaning.

### 2.4 Candidate generators (pluggable, no LLM)

| Generator | Finds | Surprise measure |
|---|---|---|
| `EmbeddingNN` | cross-space/cross-year neighbours in one embedding space | residual vs. conventional similarity |
| `TrajectoryDrift` | places that *changed the same way* across years (even from different starting states) | drift-vector cosine |
| `ClusterCrossing` | stable clusters that straddle conventional classes | cluster purity w.r.t. land cover |
| `KNNGraphBridge` | communities / bridging nodes on the kNN graph | modularity change |
| `SignatureResponse` | pairs with correlated SPI / precipitation response (reuses existing `Signature` series) | cross-correlation vs. null |

**"Unexpected" is made measurable:** fit an expected-similarity baseline from conventional predicates (same land-cover class, distance, elevation band, same admin unit, same SPI regime). Candidate interest = observed embedding similarity − baseline expectation. Interesting pairs are those the baseline can't explain.

### 2.5 LLM role

Unchanged from current Zoryn: `explanation/` gets a new context type for associations and writes prose from already-computed fields. It never scores, promotes, or invalidates.

---

## 3. Embedding data: feasibility

| Dataset | Dim | Years | Access | License (verify before commercial use) |
|---|---|---|---|---|
| AlphaEarth Foundations "Satellite Embedding V1 Annual" | 64 | 2017–2025 (2017 flagged with a quality issue on one mirror) | Earth Engine, **and** public COG mirror on Source Cooperative / AWS Open Data (`us-west-2`, listable without an account) | CC-BY 4.0 per the AWS registry and Google's GCS readme; attribution to Google/DeepMind required |
| TESSERA | 128 | 2024 confirmed complete; 2017–2024 targeted | `geotessera` Python library, 0.1° tiles | Paper is CC BY 4.0; **embedding license not confirmed**. Library needs Python ≥3.12 (Zoryn targets ≥3.11, so run it in a separate environment) |

Rules:
1. **One index per `(model, version, year-set)`.** AEF and TESSERA vectors are never mixed or compared.
2. Cross-year comparison is only valid inside one model version, and I will verify empirically (stable-land control pairs must stay close across years) rather than assume it.
3. Source of truth for the service = the COG mirror, read with windowed range requests. Earth Engine stays an optional path for the user's own research, because of its noncommercial free tier.
4. **Sizing for Nairobi:** 42,319 cells × 9 years × 64 float32 ≈ 100 MB. Exact kNN with NumPy/SciPy is trivial. No vector database, no GPU, no new infrastructure. Raw pixel reads are on the order of ~1 GB/year/county (my estimate; to measure).

---

## 4. Integration strategy

**Principle: add alongside, join by id, touch the minimum.**

```
src/zoryn/discovery/             # new package; nothing existing imports it
  representations/  (cog_reader, aggregator, provenance)
  generators/       (embedding_nn, trajectory_drift, cluster_crossing, ...)
  registry/         (events, ledger, folding to current state)
  resolution/       (tests, null models, thresholds, state machine)
  explain/          (context builder -> existing explanation service)
data/processed/discovery/{representations,associations,events,evidence}/   # Parquet
src/zoryn/rest/discovery_routes.py   # new router; app.py gets one include_router line
frontend/src/pages/Discovery/...     # new route /discovery
```

Seams with the existing chain:
- Subjects reference existing `h3_id`; Evidence ids follow the same sha256 convention, so later joins are trivial.
- Resolution **reads** existing observations/SPI through `ObservationStore`.
- When an Association reaches `established`, a later phase can emit a new Hypothesis *kind* (cross-site) so it flows into the existing Discovery → Decision stage. In the prototype this is just a documented join, not code.
- Re-evaluation uses the same "replay" idea as `ReplayEngine`: feed data in time order, evaluate triggers at each arrival.

Only modifications to existing files (later, with approval): one `include_router` line in `rest/app.py`, one `<Route>` + nav entry in `App.tsx` / `NavigationBar.tsx`.

---

## 5. The first experiment (small, measurable, falsifiable)

**Question:** do embedding-derived candidates carry information about held-out reality beyond what predefined GIS relationships already capture?

**Study area:** Nairobi County (existing H3 grid; embedded 2018–2025). Optional extension: a Nairobi–Rift–Kajiado transect so "geographically distant" pairs exist.

**Held-out ground truth** (never used to build the index): SPI/precipitation response (limited, §1.2), plus independent layers to be selected after checking availability: elevation/slope, land cover, Open Buildings (temporal) footprints, population grid, a known informal-settlement/planned-estate list. *(Availability of each to be confirmed in step 1.)*

| Step | Action | Output |
|---|---|---|
| 1 | Inventory + read AEF COGs for Nairobi 2018–2025; aggregate per cell with provenance; stable-land control check across years | `representation` table, drift calibration |
| 2 | Baselines: predicate-based similarity (land cover, elevation band, distance, admin) | baseline score per pair |
| 3 | Run generators: `EmbeddingNN`, `TrajectoryDrift`, `ClusterCrossing` | candidate associations, all state `dormant` |
| 4 | Surprise ranking = embedding score − baseline | top-N "unexpected" pairs |
| 5 | Held-out test, **spatial-block permutation null**, independent-unit counting | per-generator lift vs. baseline |
| 6 | **Temporal replay:** build candidates using years ≤ 2022, withhold 2023–2025, feed one year at a time, record state transitions | ledger showing dormant → emerging / invalidated, and whether early states predicted later co-change |
| 7 | Candidate hypotheses written as text from fields, human-reviewed | review sheet |

**Success criteria (set before running):**
- ≥1 generator beats the conventional baseline on held-out concordance at precision@k with the spatial null controlled;
- ≥X% of dormant candidates change state in the 2023–2025 replay, in the direction the held-out evidence supports (X fixed in advance);
- ≥10 reviewed "surprising" pairs that a domain reviewer judges plausible and non-obvious.

**Kill criterion:** if lift over baseline is not distinguishable from the spatial null, stop and report that embeddings add nothing for this region. That is a valid outcome.

Honest limits: one county, one embedding family, ground truth partly weak. A positive result suggests value; it doesn't prove it generalises.

---

## 6. Discovery Explorer (UI)

New route `/discovery`, built from existing reasoning components where possible.

- **Ledger board:** lanes for Dormant / Emerging / Established / Invalidated / Awaiting evidence, with counts, filters by generator and claim level.
- **Relationship detail:** pair map (both location sets linked, reusing `MapCanvas` + H3 geometry); state timeline (reusing `Timeline`); supporting vs. contradicting evidence (reusing `EvidenceList`); **"Why proposed"** panel showing similarity score, baseline-expected score, residual, rank in both directions, generator and parameters; reproducibility footer (model, version, year, code sha, seed); "what would change this" listing its re-evaluation conditions.
- Claim-level chip on every card, always visible. No unexplained AI conclusions; prose explanation is clearly marked as generated and sits below the numbers.

---

## 7. A service someone can pay for

The research engine becomes a product by changing the user's question from *"what is similar to what?"* to **"find me more like this, tell me what's changing, and remember what you're unsure about."**

**Core product: Zoryn Lookalike + Watchlist.** A customer uploads labelled points (their assets, incidents, plots, deposits, stores, outbreaks). Zoryn returns ranked lookalike locations with an auditable evidence trail, keeps unresolved candidates alive, and **alerts when a dormant candidate becomes Emerging** as new annual embeddings or new labels arrive. The recurring value is the *memory and re-evaluation*, which a one-off lab like Latent Earth does not provide.

Same engine, many sectors (each is a hypothesis to validate with customers, not a claim of demand):

| Sector | Customer question | Output |
|---|---|---|
| Agri-insurance / index insurance | Where is basis risk hidden? Which unmonitored plots behave like claim plots? | Lookalike plots; matched control groups |
| Carbon / nature markets (MRV) | Defensible baseline and matched control areas for a project | Matched controls with provenance report |
| Supply-chain / deforestation compliance | Which sourcing plots resemble ones that later converted? | Early-risk watchlist, audit trail |
| Mining & infrastructure siting | Where else does this surface signature occur? | Ranked prospects, state-tracked |
| Retail, telecom, real-estate site selection | Where do our best sites' lookalikes exist? | Lookalike map |
| Public health | Where does habitat resemble past outbreak sites? | Candidate surveillance zones |
| Utilities / municipalities | Which parcels are transforming the same way as known problem parcels? | Drift-similarity alerts |

**Why it is paid, not just interesting:** transparency and provenance are the differentiator for regulated buyers (insurers, carbon auditors, compliance teams), who need to *defend* a finding, not just receive a score.

**Packaging:** per-project subscription priced by area of interest and refresh cadence; API tier; audit-report export (PDF/JSON with full provenance); seats for the Explorer. No price points proposed yet; those need customer conversations.

**Chosen wedge: carbon and agri-insurance in East Africa** (decided by the project owner). Detailed in §7.1. Alternative wedge kept in reserve: EU deforestation-compliance watchlists.

**Constraints to respect:** AEF is CC-BY (attribution required; verify terms before launch); don't route paid workloads through a user's noncommercial EE quota; TESSERA embedding license unconfirmed; and no outputs should be marketed as causal.

---

### 7.1 The wedge: two products on one engine

Both products need the same primitive: *given places with known outcomes, find and rank other places that behave like them, show why, and keep re-checking.*

**A. Insurance: homogeneous-risk zone design and basis-risk map**

- Pain (from the literature): Stigler & Lobell (AJAE 2024, Kenya maize, 10 m satellite data) split basis risk into zonal heterogeneity and index design error, and find that the maximum insurable risk is low because yields vary strongly within zones; they argue finer zones would help. Embedding-defined zones are a direct candidate for that.
- Product: cluster a portfolio's fields by embedding trajectory, test whether those zones have lower within-zone yield variance than administrative zones, and flag fields where a rainfall index would be a poor proxy for the field's behaviour.
- **Fit with existing Zoryn:** the SPI3/6/12 pipeline already produces a standard rainfall-deficit index, which is a common index-insurance trigger. The discovery engine would answer "where does this index mislead?", a natural extension of what Zoryn already does.
- Buyer needs to bring: yield or crop-cut data, claims history, or policy-location data.

**B. Carbon: matched controls and baseline robustness**

- Pain: Verra's VM0047 (ARR) was described in its webinar as a dynamic performance benchmark using remote sensing, with projects required to outperform a matched benchmark. Matching quality is therefore a core audit question. (VM0048 for REDD+ moves baselines to jurisdiction level, which reduces project-level matching demand there. I did not find the exact matching rules in either methodology and have not read them in full.)
- Product: for a project polygon, find control areas that match on embedding history plus conventional covariates, report covariate and pre-period trajectory balance, run placebo tests, and keep a ledger of which candidate controls were rejected and why.
- **Positioning risk:** whether verifiers or registries would accept embedding-based matching is unproven. Initial positioning should be a *screening and robustness check* beside the prescribed method, not a replacement baseline.
- Buyer needs to bring: project boundaries and start dates, plus whatever the methodology prescribes.

**What this changes in the plan:**

1. **Study area moves off Nairobi County**, which is mostly urban. No proprietary data is available, so the area follows where *public* labelled data exists (§7.2): **Western Kenya** for the insurance experiment, and an area chosen from the open carbon-boundary database for the carbon experiment. The existing H3 + CHIRPS + SPI notebooks (`01`–`06`) can be re-run on a new AOI.
2. **Held-out truth becomes outcome data**, not only context layers: public crop-cut yields (insurance); public forest-change layers and open project boundaries (carbon).
3. **Two product-shaped experiments** replace the generic "unexpected pairs" test:
   - *Insurance:* do embedding zones beat administrative zones on within-zone yield variance, with block cross-validation to avoid spatial leakage?
   - *Carbon:* placebo test. Treat a known non-project area as "treated" and see whether embedding-based controls reproduce its pre-period trajectory better than conventional covariate matching.
4. The generic discovery experiment (§5) still runs first, on the new AOI, because both products depend on its result.

**What I could not verify:** the exact data and matching rules of VM0047/VM0048; which labelled yield or project datasets are legally usable for a commercial product; actual willingness to pay.

### 7.2 Public-data plan (no proprietary data)

All of this came from web search results; **I have not opened or downloaded any dataset.** Contents, sizes, Kenya coverage and licenses must be confirmed in Phase 0.

| Need | Candidate public source | What the search reported | To verify |
|---|---|---|---|
| Field-level yields (insurance truth) | **Confirmed in Phase 0:** One Acre Fund maize survey, Zenodo 10.5281/zenodo.11122388 (CC BY 4.0, 5.6 MB). The Lacuna "corrected geolocation" version (~18,000 points, 2015–2019) could not be confirmed on Lacuna's own page; see §10 | See §10 | See §10 |
| Yield, wider | GROW-Africa (Zenodo, ~535 k georeferenced yield records, 1960–2023, includes maize) | Georeferenced, 287 MB | How many are field-level in Kenya after 2017 |
| Yield, coarse fallback | HarvestStat Africa (administrative yields) | Aggregated, not field level | Only useful as a sanity check |
| Crop type / field boundaries | Radiant Earth western-Kenya set (3,000+ fields, 2019); SustainBench Kenya (2017: Bungoma, Busia, Siaya); Helmets Kenya (4,925 points, 2021–22); Eyes on the Ground (8 counties) | Crop type, not yield; useful to restrict to maize fields | Licenses; CropHarvest is CC-BY-**SA**, and share-alike could be a problem for a commercial product |
| Carbon project boundaries | Karnik et al. 2025 open database (575 nature-based projects, 55 countries, GeoParquet on Source Cooperative; Zenodo CSV index with project type) | Filterable to ARR; boundaries flagged "official" vs "georeferenced"; not a census | How many Kenyan/East African ARR projects; license; boundary quality |
| Forest-loss outcome | Hansen Global Forest Change (v1.12 reported) | Older versions CC-BY 4.0; EE catalog says research/nonprofit use | v1.12 license; use direct download rather than Earth Engine for commercial work |
| Land cover for baselines | ESA WorldCover (2020/2021) | CC-BY 4.0, free of restriction | Fine |
| Rainfall / drought index | CHIRPS (already used) via existing pipeline | In repo | Extend to new AOI |

**Insurance experiment (Western Kenya):**
1. Keep crop-cut fields whose year overlaps an AlphaEarth year (2018, 2019; 2017 only with the quality caveat). Record the count per county first. If effective independent sites are too few (fields cluster in a handful of villages), stop and report that the public data cannot support the test.
2. Build zones three ways: administrative boundaries (public), conventional covariates (elevation, rainfall regime, land cover), and embedding clusters. Compare within-zone yield variance with **spatial block cross-validation**, so near-neighbour fields don't leak across train and test.
3. Compare the CHIRPS-SPI index against field yields to quantify basis risk, then ask whether embedding-defined strata reduce it.
4. Success: embedding zones beat both conventional baselines out-of-block. Kill: they don't.

**Carbon experiment:**
1. From the open boundary database, take ARR projects in or near East Africa. Count them first; if there are too few, widen the region or use projects elsewhere for the method test only.
2. Use Hansen forest loss as a methodology-agnostic outcome, and a pre-period (before project start) for matching. For each project, find controls from embeddings plus conventional covariates, then compare **pre-period trajectory balance** and a **placebo test**: pick non-project areas as pseudo-projects and check whether matched controls reproduce their later outcome.
3. Caveat: Hansen measures loss, while ARR is about gain. Post-2012 canopy gain needs another public layer (for example canopy-height or land-cover change products), which I haven't evaluated. So this experiment tests *matching quality*, not ARR additionality.
4. Success: embedding-based matching improves balance and placebo error over conventional matching. Kill: no improvement.

**What public data can and cannot show:** it can test whether the method works and produce a public case study. It cannot show that a buyer will rely on it; that needs a customer's labels (Phase 5).

---

## 8. Phasing

| Phase | Deliverable | Gate to continue |
|---|---|---|
| 0 | This proposal reviewed; data inventory (AEF COG access for Nairobi, license read in full, held-out layers confirmed) | Data is actually retrievable |
| 1 | Representation ingest + provenance + stable-land control (§5 steps 1–2) | Controls are stable across years |
| 2 | Generators, baseline, held-out test, spatial null (steps 3–5) | Lift over baseline vs. null |
| 3 | Ledger + replay re-evaluation (step 6) | Meaningful state transitions |
| 4 | API + Discovery Explorer MVP | Reviewer finds pairs plausible |
| 5 | One customer-shaped pilot on the wedge, with their labels | A real buyer will pay |

---

## 9. Open decisions for you

1. Code name for the link type: `Association` (my recommendation, avoids clashing with `knowledge.Relationship`) vs. renaming the existing class (invasive).
2. Registry storage: append-only Parquet + Polars (consistent with repo, my recommendation for the prototype) vs. SQLite for transactional updates later.
3. Study area: **Western Kenya for insurance, carbon AOI to be picked from the open boundary database** (§7.2), rather than Nairobi County or a Central Highlands transect. Confirm.
4. Wedge: **decided — carbon and agri-insurance** (§7.1). Open: which of the two leads (insurance first is my lean, because the SPI pipeline already exists and the test is simpler).
6. Labelled data: **decided — public data only** (§7.2). Phase 0 must confirm the datasets are large enough and licensed for the intended use.
5. Whether the dead `lifecycle.py` should be repaired or retired — separate from this work.

---

## 10. Phase 0 findings (2026-11-08)

Method: read dataset pages, fetched two small files into the session scratchpad (not the repo): the carbon project index CSV (122 KB) and the One Acre Fund maize survey CSV (5.6 MB, md5 matches the Zenodo record), and listed the AlphaEarth bucket (listing only, no tile downloaded). Scripts are in the scratchpad, run with `python -I`.

### 10.1 Insurance: public yield data is usable

**Source:** One Acre Fund maize survey, 2016–2022, CC BY 4.0. Yield is **measured** (two 36 m² harvest boxes per field), not farmer-reported.

| Fact | Value |
|---|---|
| Kenya rows | 7,258 (all "first season"); years 2016–2020 only |
| By year | 2016: 1,111 · 2017: 921 · 2018: 1,180 · 2019: 1,755 · 2020: 2,291 |
| Overlap with AlphaEarth years (2018–2020) | 5,226 Kenya fields (about 5,200 after excluding fields at heavily shared coordinates) |
| Spatial extent | lon 34.0–37.8, lat −1.16 to 1.22: western Kenya, reaching further east |
| Spread | 853 distinct 0.05° (~5 km) cells; only 28 cells hold ≥30 fields and none ≥100 |
| Yield | mean 3,020 kg/ha, sd 1,707 |
| Uganda rows | only 109 (2020), too few to use |
| Columns | includes `lon`, `lat`, `year`, `yield_kg_ha`, `strat`, `cz`, plus CHIRPS-derived rainfall, elevation, soil and management variables |

What this means:
- **Good news:** thousands of measured, geolocated fields across hundreds of sites in the AlphaEarth years. Wide dispersion suits spatial block cross-validation.
- **Constraint:** per-site depth is thin. Within-site comparisons (same cell, many fields) are not available, so the test must be across sites.
- **Caveats:** the paper reports ~21% of fields were located from the nearest town and ~9% from the district, and says those were kept in the final file. The CSV has no flag for this. My duplicate-coordinate check flagged only 49 Kenya fields, which means **it cannot detect the approximated ones**. Before any analysis I must read the paper's methods and find a defensible filter. Soil and topography variables exist only for GPS-located fields, which may give a usable proxy flag.
- **Leakage:** the file's rainfall and soil variables are themselves conventional covariates. That is helpful for the baseline, but they must be excluded when building embedding-only zones.
- **Not yet computed:** any variance-explained comparison. I ran a within-cell variance share but it is biased by one-field cells, so I am not reporting it.

### 10.2 Carbon: the public data constrains the experiment more than expected

From the 575-project index (CC BY 4.0, boundaries in a 311 MB Africa GeoPackage / 80 MB GeoParquet, **not downloaded**):

| Fact | Value |
|---|---|
| Africa projects | 72 (46 ARR, 24 AD, 2 IFM) |
| **Kenya** | 13 projects: 9 ARR, 4 AD |
| Kenya ARR boundary quality | 6 of 9 are "Linear" (buffered features; accuracy not assessed by the authors), 3 "Official" polygons |
| Kenya ARR start dates | seven TIST programmes from 2004 (one 2015), Komaza from 2017 |
| Uganda ARR | 11 projects |

**Critical constraint:** AlphaEarth starts in 2017. Matching on embedding *pre-period* history needs years before project start. For Kenya that leaves **no usable ARR project** (Komaza starts May 2017 with, at most, the flagged 2017 layer). Across Africa, ARR projects starting 2018 or later are about 8: Ghana (3), Republic of the Congo (2), Tanzania (1), Zambia (1) and Rwanda (1, point geometry only), plus one Sierra Leone record with a 2026 start date that looks like a data error. About 7 have polygons. These are enough for a method demonstration, not for statistics.

Consequences for the plan:
- The carbon experiment becomes a **placebo-based method test** (pseudo-projects drawn from non-project land, anywhere AlphaEarth covers), validated on those ~7 real polygons as illustration. It cannot say anything about Kenya's older projects with embeddings.
- For older projects, embeddings could only be used as a *post-period* similarity feature, which weakens the matching story. This should be stated plainly to any carbon buyer.
- The carbon wedge is therefore **weaker than the insurance wedge** on public data. This changes the lead recommendation (§10.4).

### 10.3 AlphaEarth access and licensing

- The bucket `s3://us-west-2.opendata.source.coop/tge-labs/aef/v1/annual/` is **publicly listable without an account**. Year prefixes 2017–2025 exist; below each is a UTM-zone prefix (`10N`, `10S`, …). Index files (`aef_index.parquet`, 78 MB; `.csv`, 798 MB; `.gpkg`, 539 MB) and a STAC GeoParquet index are provided. (I did not open any tile, so band count, dtype and quantisation are **unverified**.)
- **Discrepancy:** the AWS registry text says 2018–2024; the bucket has 2017–2025 prefixes. A mirror page also flagged a 2017 quality problem. Treat 2017 as unusable until checked, and confirm 2025 is complete.
- License: CC-BY 4.0 with attribution to Google and Google DeepMind (AWS registry). The registry page does not say whether Google supports the mirror.
- Western Kenya spans UTM zones 36N and 37N/37S, so tile reads must handle more than one zone and reproject.

### 10.4 Updated licensing and risk table

| Dataset | License | Commercial concern |
|---|---|---|
| AlphaEarth (COG mirror) | CC-BY 4.0 | Attribution; mirror support unclear |
| One Acre Fund maize survey | CC BY 4.0 | Attribution |
| Carbon boundary database | CC BY 4.0 | Attribution; boundaries partly digitised |
| Eyes on the Ground | **CC-BY-SA 4.0** | Share-alike: avoid for a paid product, or isolate carefully |
| CropHarvest | CC BY-SA 4.0 | Same |
| Hansen forest change | CC-BY (older versions); EE page says research use | Use direct download, confirm v1.12 terms |
| GROW-Africa | CC BY 4.0 | Fine; 287 MB; Kenya counts not yet checked |

### 10.5 Go / no-go

| Item | Verdict |
|---|---|
| AlphaEarth reachable at no cost for the study area | **Go** (listing confirmed; tile read not yet tested) |
| Insurance experiment on public data | **Go**, with the location-quality caveat resolved first |
| Carbon experiment on Kenya projects | **No-go** as originally framed (no usable pre-period); **go** as a placebo method test |
| Lead wedge | **Insurance first.** Public data supports it better, and it reuses the SPI pipeline |

### 10.6 Phase 0 closure checks (completed 2026-11-08)

**1. Location quality of the yield survey: unresolved, with a mitigation.**
- The paper (Aramburu-Merlos et al., Nature Communications 15:4492) confirms GPS for ~70% of fields; ~21% were assigned from the nearest town and ~9% from the district "only to retrieve climate data", and 351 observations without geolocation were removed. It states **no flag and no location error estimate**, and gives no per-year Kenya counts.
- I tested whether the CSV carries a usable flag. **It does not:** the terrain variable `twi` is present for all 7,258 Kenya rows, coordinates show no coarser precision for any subgroup, and only 188 rows (2.6%) lack soil values. That 2.6% is the only candidate flag, and it is far below the paper's 30%, so I cannot say which rows are approximated.
- Mitigation: sample AlphaEarth as a neighbourhood mean (not one 10 m pixel), analyse at ~1–5 km site level, and run every result twice (all fields vs. excluding soil-missing rows). Field GPS is also known to be offset from field centres in this kind of survey (the Lacuna/Zindi work below), which is another reason not to use a single pixel.

**2. AlphaEarth tile layout (read from the header, no pixel data downloaded).**

| Property | Value |
|---|---|
| Tile | 8,192 × 8,192 px at 10 m (~82 km), BigTIFF COG, one `.vrt` sidecar per tile |
| Bands | 64, Int8, nodata −128 |
| Internal layout | **band-separate (planar)**, 1,024 × 1,024 blocks, ZSTD, 8 overview levels |
| CRS | UTM zone per prefix (e.g. EPSG:32636 for 36N) |
| Coverage of the 5,226 fields (2018–2020) | 23 tiles per year intersect the Kenya field extent across 36N/37N/36S/37S |
| Not yet located | 350 fields (6.7%) fell outside the tiles I could identify. Likely tile groups whose first tile is missing; resolve with the official index file (`aef_index.parquet`, 78 MB) in Phase 1 |
| Dequantisation | not verified (I did not decode pixels; no ZSTD decoder in the available Python) |

**3. Read volume (computed exactly from the tile's byte-count table).**
- Because bands are stored separately, a single field point needs **64 band-blocks**, about **37.5 MB compressed per 1,024-px block** (range 34–40 MB in the tile I measured).
- 2018–2020 fields touch **291 distinct blocks**, so about **11 GB per year, ≈33 GB for 2018–2020** (≈100 GB for 2018–2025) if read through the public COGs.
- That is feasible but not "a few MB". Two ways to avoid it: (a) for the research phase only, use Earth Engine point sampling on the owner's own noncommercial project (only values transfer); (b) fetch once and cache a compact per-field neighbourhood table, so the 33 GB is a one-time cost. A production service would use (b) with the public COGs.

**4. Hansen forest change.** v1.12 is **CC-BY-4.0** per the Earth Engine catalog and is **superseded by v1.13**. Its `gain` band covers **2000–2012 only and was never updated**, so no public post-2012 tree gain exists in this product. The carbon placebo can use Hansen **loss** (2001–2024) only; an ARR gain layer is still unchosen.

**5. Lacuna corrected field locations.** Found on figshare (CC BY 4.0): "GPS Coordinates of 18,482 Crop Fields in East Africa with Improved Accuracy" (Zindi/Vais 2021). Its files include a 2.8 MB data CSV plus an 862 MB image archive. It appears to be a **location-correction method and data set, not a yield table**, and I found no way to join it to the Zenodo survey fields. Treat it as background on location error, not as a data source. The page returned HTTP 403 to the fetch tool, so I read it through the figshare API.

### 10.7 Revised experiment constraints after Phase 0

- **Unit of analysis:** ~1–5 km sites, 2018–2020, with embedding values as neighbourhood means.
- **Sample:** ≈5,000 fields minus the unlocated 6.7% and any filtered rows; 291 blocks per year.
- **Compute path:** needs a ZSTD-capable raster reader (for example rasterio/GDAL in an isolated environment) and a one-time ~33 GB read, or Earth Engine sampling for the research phase.
- **Open risk:** the unflagged location noise could mask any real embedding signal; this makes the **kill criterion** (§5) more likely to trigger for reasons unrelated to the idea. The double analysis in item 1 is meant to separate the two.
