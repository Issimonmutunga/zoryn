# Phase 1, step 2: do embeddings add to conventional covariates? (yield, Kenya 2018-2020)

> **Current verdict (tightened re-run, `baseline_tight.py`): MIXED.** The v1 "SUCCESS" below is superseded.
> Embeddings add a small, real spatial signal over a strong baseline, but **do not transfer to an unseen year**.

## Tightened re-run (`baseline_tight.py`, results in `out/baseline_tight_results.json`)

Baseline G1 = environment + **management** covariates; G2 = G1 + 64 embedding dims. HGB is the primary model (size test and
nulls use the same model); 30 permutations per null (field-level shuffle and spatial-block shuffle). Out-of-fold R2.

| Config | HGB G1 | HGB G2 | **dR2** | above field null / block null (p95) | Ridge dR2 |
|---|---|---|---|---|---|
| 0.25 deg blocks, all fields | 0.304 | 0.322 | **+0.017** | yes / yes (p95 -0.012 / -0.022) | +0.051 |
| 1.0 deg blocks (~110 km), all fields | 0.219 | 0.258 | **+0.039** | yes / yes (p95 -0.022 / -0.006) | +0.030 |
| Leave-one-year-out, all fields | 0.125 | 0.048 | **-0.077** | **no / no** (p95 -0.003 / -0.023) | -0.373 |
| 0.25 deg blocks, excl. soil-missing | 0.299 | 0.322 | **+0.023** | yes / yes (p95 -0.008 / -0.005) | +0.044 |

Pre-set rule: SUCCESS needs dR2 >= 0.02 and above both nulls in all four configs; KILL needs failure in all four. Neither
holds, so **MIXED**.

What it says:
- **Spatial generalisation: real but small.** Over a strong management baseline the embeddings add +0.017 to +0.039 R2 on
  held-out places, above both permutation nulls (the nulls are negative because scrambled features hurt the model).
  The lift is largest on the harder 110 km blocks.
- **Temporal generalisation: fails.** Holding out a whole year, adding embeddings makes predictions worse (HGB -0.077,
  ridge -0.37), and embeddings alone are worse than the mean (-0.067). Plausible cause (not tested): the embeddings encode
  year-specific conditions that do not transfer; with only 3 years each fold is also a different mix of sites
  (1,180 / 1,755 / 2,291 fields), so this test mixes year and geography.
- **Consequence for an insurance use:** a product must predict unseen seasons; on this evidence the embeddings help rank
  sites within seasons already observed, not forecast a new one.
- Management covariates matter far more than embeddings: they lift HGB from 0.153 to 0.304.
- Unchanged risks: ~30% approximated survey locations (no flag), 3 years, one country, absolute R2 modest (<= 0.32).

## Suggested next steps

- Test whether the year failure is drift or composition: per-year standardise embeddings; check stable-land embedding
  change across 2018-2020 (the proposal's drift calibration); try leave-one-year-out within a fixed set of sites.
- Add more years (survey goes to 2022; AlphaEarth to 2025) so a temporal test has more than 3 folds.
- Steps 3-4 of the proposal (candidate generators, surprise ranking) only if the spatial signal is worth pursuing.

---

## v1 (superseded): `baseline_vs_embedding.py`

Script: `baseline_vs_embedding.py` · raw numbers: `out/baseline_results.json` · data: One Acre Fund maize survey
(5,226 Kenya fields) + AlphaEarth level-4 (160 m) 7x7-pixel neighbourhood means (~1.1 km), `build_field_table.py`.

Validation: whole 0.25-degree blocks (~28 km, 77 blocks) held out, 5 folds x 3 repeats. Metric: out-of-fold R2.

## Results (out-of-fold R2)

| Model | Ridge, all | Ridge, excl. soil-missing | HGB, all | HGB, excl. soil-missing |
|---|---|---|---|---|
| M0 year only | -0.017 | -0.014 | -0.019 | -0.014 |
| M1 conventional covariates | 0.083 | 0.094 | 0.153 | 0.155 |
| M2 M1 + embeddings | 0.167 | 0.166 | 0.175 | 0.174 |
| M3 embeddings only | 0.188 | 0.182 | 0.167 | 0.163 |
| **dR2 (M2 - M1)** | **+0.084** | **+0.072** | **+0.022** | **+0.019** |

Nulls for the ridge dR2 (100 permutations each): field-level shuffle p95 = +0.005 / +0.006; spatial-block shuffle
p95 = +0.002 / -0.008. The real ridge dR2 is above both nulls in both analyses.

## Verdict against the pre-set criteria: SUCCESS, with caveats that matter

1. **The ridge lift overstates the benefit.** Ridge underfits the conventional covariates (0.083 vs 0.153 for
   gradient boosting), so M1-ridge is a weak baseline. Against the stronger nonlinear baseline the lift is about
   **+0.02 R2** (0.022 all fields, 0.019 excluding soil-missing, i.e. just under the 0.02 threshold in one analysis).
   The success rule took the better of the two model families for the size test and ridge for the null test; that
   is a loophole I should have closed. A permutation null for HGB was not run.
2. **What is solid:** embeddings alone (0.167-0.188) predict held-out yield about as well as all conventional
   covariates together (0.153), and that is under spatial block CV with the nulls controlled.
3. **What this does not show:** that embeddings add *new environmental information*. They can proxy site-level
   crop/management/land-cover differences that drive yield. Absolute R2 is low (~0.17-0.19) throughout.
4. **Data risks unchanged:** ~30% of survey locations are approximated (no flag), 3 years only, one country,
   no management covariates (N, hybrid) in M1; the 0.25-degree blocks may not fully remove spatial leakage.
5. **Criteria history:** the criteria were written by me before the run, not reviewed by the project owner. After a
   5-permutation smoke run I added the spatial-block null (the proposal asked for it; the first null was too weak).

## Suggested next steps

- Close the loophole: HGB permutation nulls, and add management covariates to M1.
- Larger blocks (e.g. 1 degree) and leave-one-year-out as a harder transfer test.
- Only then Steps 3-4 (candidate generators, surprise ranking) of the proposal.
