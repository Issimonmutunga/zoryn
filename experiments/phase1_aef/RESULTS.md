# Phase 1, step 2: do embeddings add to conventional covariates? (yield, Kenya 2018-2020)

> **Current verdict (tightened re-run, `baseline_tight.py`): MIXED.** The v1 "SUCCESS" below is superseded.
> Embeddings add a small, real spatial signal over a strong baseline, but **do not transfer to an unseen year**.
> The drift test (below) attributes the failure to year-specific embedding values, not to which sites are surveyed;
> with the imagery year held fixed the gain is small but positive (full suite, last table below: +0.017 to +0.046, above both nulls in all four configs; just under the 0.02 size bar in leave-one-year-out). Stable-land calibration shows most of the
> year shift is common to all land cover (cosine ~0.9 with the cropland shift) and removes ~80% of the loss, but not all of it.

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

## Drift vs composition test (`drift_test.py`, results in `out/drift_results.json`)

Question: why did embeddings fail leave-one-year-out (LOYO)? Rules were fixed before the run (see the script docstring):
DRIFT if survey-year embeddings fail but >= 2 of 3 fixed-reference-year variants are positive and above the block null.
Every field was re-sampled from each of 2018, 2019 and 2020 imagery (`build_field_table.py --embed-year`).

**Diagnostics**
- **Year is trivially identifiable from survey-year embeddings: 100% accuracy** (majority class 44%) under spatial block CV.
  Embeddings of the *same sites* sampled from a fixed reference year predict the survey year at or below chance (37-39%).
  So the year signal sits in the imagery year, not in which sites were surveyed.
- The paired mean shift between years is **1.0-1.5x the between-field spread**, and the same site's embedding in two years is
  **no more similar than two random fields in one year** (cosine 0.89-0.94 vs 0.90-0.91). Year offsets dominate site differences.

**LOYO, HGB, gain over the environment + management baseline (G1 = 0.125)**

| Embedding variant | HGB dR2 | above block-null p95? | Ridge dR2 |
|---|---|---|---|
| survey-year (as before) | -0.077 | no | -0.373 |
| every field from 2018 imagery | -0.030 | no | +0.035 |
| every field from 2019 imagery | +0.010 | yes | +0.031 |
| every field from 2020 imagery | +0.003 | yes | +0.030 |
| survey-year, standardised within each year | -0.014 | no | +0.037 |

**Verdict under the pre-set rule: DRIFT** (2 of 3 fixed-year variants positive and above the null). Read it carefully:
- **The failure is the year-specific embedding values.** Holding the imagery year fixed removes most of the damage (-0.077 -> about 0).
- **But it does not turn into a positive result.** The recovered gains are tiny (+0.003, +0.010; 2018 is still negative) and
  the nulls are themselves negative, so "above the null" is a low bar here. There is no evidence that embeddings forecast
  an unseen season; at best they are neutral.
- **Per-year standardising is not enough** (-0.014), so the year shift is more than a mean/scale offset.
- A 100%-identifiable year offset this large is unusual; I have not ruled out a processing difference between the yearly
  products. The proposal's stable-land drift calibration (sample forest/urban pixels across years) is the direct check.
- **Practical reading:** use a single fixed-year embedding as a static site descriptor, and do not feed year-specific
  embeddings to a model that must generalise across seasons. The spatial result above used survey-year embeddings; it has not
  been re-run with a fixed reference year.

## Stable-land drift calibration (`select_stable_sites.py`, `stable_calibration.py`, `out/stable_calibration_results.json`)

Question: is the year shift a product-level offset or real change? 99 homogeneous stable patches (43 tree, 42 open water,
14 built-up; >= 95% / 80% class purity at 10 m) were picked from ESA WorldCover v200 (2021) and sampled from AlphaEarth for
2018, 2019 and 2020 with the same 7x7 level-4 window as the fields. Assumption, not tested: these classes were unchanged 2018-2020.
Decision rules were fixed in the script before any result existed.

| Year pair | stable shift / field shift (magnitude) | cosine(stable shift, field shift) | same-site cosine: tree / water / built |
|---|---|---|---|
| 2018 -> 2019 | 0.64 | 0.93 | 0.95 / 0.98 / 0.95 |
| 2019 -> 2020 | 0.64 | 0.90 | 0.91 / 0.97 / 0.90 |
| 2018 -> 2020 | 0.59 | 0.89 | 0.94 / 0.98 / 0.93 |

- **Stable land shifts too, and in the same direction as cropland.** Forest, open water and built-up move by 0.5-1.2x their
  between-site spread, with a shift vector almost parallel to the cropland shift (cosine 0.89-0.93) and 60-64% of its size.
  So most of the year shift is **common to all land cover**, not specific to crops.
- **Calibration helps a lot but not enough.** Estimating a per-year offset from the stable sites only and subtracting it from the
  survey-year embeddings lifts leave-one-year-out dR2 from -0.077 to **-0.016** (recovering about 80% of the loss), but that is
  still below the block-null p95 (-0.008). **Rule outcome: PARTIAL** (PRODUCT_OFFSET needed it to clear the null).
- **Not resolved:** a shift shared by every land cover is consistent with a product-level offset *or* a regional year effect
  (e.g. rainfall changing vegetation and water appearance). Open water and forest are not perfectly "stable", so this test cannot
  tell the two apart; the class-specific shifts also differ (water vs tree cosine 0.30-0.67), and built-up has only 14 sites.
- **What it means for use:** subtracting a stable-land reference per year is a workable partial fix. Even with it, there is no
  positive out-of-year gain from embeddings in this data, so they are not yet a forecasting input.

## Full tightened suite with a fixed reference year and with stable-land calibration

Same script, rules and nulls as the tightened re-run (`baseline_tight.py --emb ...`); only the embedding input changes.
`ey2019` = every field sampled from 2019 imagery; `cal` = survey-year embeddings minus a per-year offset from stable land
(`make_calibrated.py`). HGB dR2 over the env+management baseline; all runs above both nulls unless marked.

| config | own year (original) | fixed 2019 imagery | stable-calibrated |
|---|---|---|---|
| block 0.25 deg | +0.017 | +0.027 | +0.020 |
| block 1.0 deg | +0.039 | +0.046 | +0.053 |
| leave-one-year-out | -0.077 (below nulls) | +0.017 (above both nulls) | -0.017 (below nulls) |
| excl. missing soil, block 0.25 | +0.023 | +0.022 | +0.019 |
| verdict (rule: all four >= 0.02 and above both nulls) | MIXED | MIXED | MIXED |

- Fixed 2019 imagery is the only variant that passes the year-transfer test, and it is above both nulls in all four configs.
  It misses the pre-set 0.02 size bar in one (leave-one-year-out, +0.017), so by the rule it stays MIXED. I did not relax the rule.
- Stable-land calibration does not rescue year transfer here (still below nulls), consistent with the PARTIAL calibration result.
- Caveat: fixed-year imagery means 2018 fields use imagery from a later year. It treats the embedding as a static site
  descriptor, not a within-season signal. Gain sizes are small (+0.02 to +0.05 R2 on a 0.15-0.30 base).

## Suggested next steps

- Re-run the spatial block-CV experiment with a fixed reference year (or stable-land-calibrated) embedding.
- Add more years (survey to 2022, AlphaEarth to 2025) so a temporal test has more than 3 folds and the year offset can be
  modelled; check whether the offset tracks annual rainfall (a regional effect) or is constant per year (a product effect).
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
