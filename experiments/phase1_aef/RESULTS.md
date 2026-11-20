# Phase 1, step 2: do embeddings add to conventional covariates? (yield, Kenya 2018-2020; year transfer 2016-2020)

> **Current verdict (updated 2026-11-20): MIXED on space; year transfer is now positive by the pre-set rule on 4-5 years, but
> fragile (it was negative on 3 years).** The v1 "SUCCESS" below is superseded.
> - **Space:** embeddings add a small, real signal on held-out places over a strong management baseline (+0.02 to +0.05 R2,
>   above both nulls; tightened suite, `baseline_tight.py`).
> - **Time:** on three years (2018-2020) survey-year embeddings made an unseen year worse (-0.077) and fixed-year imagery was
>   about neutral (+0.010). With 2017 added, and 2016 for fixed-year imagery, both are positive and above both nulls
>   (+0.064 survey-year; +0.063 and +0.053 fixed-2019; section "Year transfer with more survey years"). So the earlier
>   "does not transfer to an unseen year" is withdrawn. The gain survives a baseline limited to covariates recorded in every
>   year (+0.046 to +0.066, above both nulls). Treat it as provisional: the sign flipped by adding one year, the baseline's own
>   out-of-year skill swings with the training years, 4-5 folds is few, and total skill on an unseen year stays low
>   (R2 0.12-0.15).
> - The year shift itself is real: survey year is 100% identifiable from the embeddings, and most of the shift is common to
>   all land cover (drift and stable-land sections).
> - A correction to the fixed-year / calibrated table is noted in its section: two library versions were mixed, which moves
>   those gains by up to 0.012 without changing any verdict.

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

**Correction (2026-11-20): the three columns above were not computed under one library version.** The "own year" column ran
under scikit-learn 1.9.1; the fixed-2019 and calibrated columns ran under 1.8.0 (the re-run used a different Python
environment). The same code and data give slightly different gradient-boosting results under the two versions (baseline G1
on 0.25 deg blocks: 0.3043 vs 0.3005). Point estimates re-run under 1.9.1 (`baseline_tight.py --perms 0`,
`out/baseline_tight_ey2019_point.json`, `out/baseline_tight_cal_point.json`):

| config | own year | fixed 2019 imagery | stable-calibrated |
|---|---|---|---|
| block 0.25 deg | +0.017 | +0.021 (was +0.027) | +0.019 (was +0.020) |
| block 1.0 deg | +0.039 | +0.054 (was +0.046) | +0.042 (was +0.053) |
| leave-one-year-out | -0.077 | +0.010 (was +0.017) | -0.016 (was -0.017) |
| excl. missing soil, block 0.25 | +0.023 | +0.030 (was +0.022) | +0.025 (was +0.019) |

- No sign changes and no verdict changes (MIXED in all three). But the library version alone moves these gains by up to 0.012,
  which is as large as the differences between the columns, so the columns should not be ranked against each other.
- The fixed-2019 leave-one-year-out gain is +0.010 like-for-like (it matches `drift_test.py`), not +0.017. "Just under the
  0.02 bar" overstated it.
- The nulls were not re-run under 1.9.1. The 1.8.0 null p95s (at most +0.0002) are below every positive gain in the table.
- The environment used for all other results is now recorded in `requirements.experiments.lock.txt`.

## Year transfer with more survey years (`loyo_more_years.py`, `out/loyo_more_years_results.json`)

Question: every year-transfer conclusion above rests on three folds (2018-2020). Does it hold with more years? The survey
also has Kenya fields for 2016 and 2017 (none after 2020), and AlphaEarth starts in 2017. So survey-year embeddings can be
tested on 4 years (2017-2020, 6,147 fields) and fixed-2019 imagery on 5 (2016-2020, 7,258 fields). Decision rules were fixed
in the script before the run. HGB, leave-one-year-out, gain over the env + management baseline G1, 100 permutations per null,
scikit-learn 1.9.1, 0 fields without a valid embedding.

| Embedding variant | Survey years (folds) | G1 | G1 + emb | **dR2** | field / block null p95 | Ridge dR2 |
|---|---|---|---|---|---|---|
| survey-year imagery | 2018-2020 (3), reproduces earlier | 0.125 | 0.048 | **-0.077** | below both (earlier run) | -0.373 |
| fixed 2019 imagery | 2018-2020 (3), reproduces earlier | 0.125 | 0.135 | **+0.010** | above both (earlier run) | +0.031 |
| survey-year imagery | 2017-2020 (4) | 0.070 | 0.134 | **+0.064** | +0.010 / +0.025 | -0.065 |
| fixed 2019 imagery | 2017-2020 (4) | 0.070 | 0.133 | **+0.063** | +0.014 / +0.032 | +0.004 |
| fixed 2019 imagery (primary) | 2016-2020 (5) | 0.097 | 0.150 | **+0.053** | +0.017 / +0.024 | +0.012 |

**Rule outcome: TRANSFER_HOLDS** (primary +0.053 is >= 0.02 and above both nulls; the 4-year check is positive and above
both nulls). `own_year_fails_again` = false. That is the rule as written. The rule did not anticipate the baseline changing
between year sets, and that matters for how to read the result.

Read it carefully. The headline gains are real against the nulls, but they are not a like-for-like improvement on the
3-year result. R2 inside each held-out year (against that year's own mean; added after the first results were seen,
`--perms 0`, `out/loyo_more_years_diag.json`):

| Held-out year | Trained on | G1 | G1 + survey-year emb | G1 + fixed-2019 emb |
|---|---|---|---|---|
| 2019 | 2018, 2020 | 0.208 | 0.105 | 0.257 |
| 2019 | 2017, 2018, 2020 | 0.185 | 0.210 | 0.250 |
| 2020 | 2018-2019 | 0.085 | -0.002 | 0.045 |
| 2020 | 2017-2019 | **-0.055** | 0.077 | 0.062 |
| 2020 | 2016-2019 | -0.004 | n/a (no 2016 imagery) | 0.060 |
| 2018 | 2019-2020 | 0.028 | 0.016 | 0.044 |
| 2018 | 2017, 2019-2020 | 0.027 | 0.021 | 0.021 |
| 2017 | 2018-2020 | 0.064 | 0.161 | 0.107 |
| 2016 | 2017-2020 | 0.049 | n/a | 0.100 |

- **The 3-year failure of survey-year embeddings does not replicate.** With one more training year their own skill improves
  (2019: 0.105 -> 0.210; 2020: -0.002 -> +0.077). The earlier failure looks specific to models trained on only two years of
  year-shifted embeddings. The statement "embeddings do not transfer to an unseen year" is withdrawn.
- **Part of the larger gain is the baseline getting worse, not the embeddings getting better.** Adding 2017 to training drops
  the baseline on 2020 from +0.085 to -0.055, while the fixed-2019 model barely moves (2020: 0.045 -> 0.062; 2019: 0.257 ->
  0.250). My first suspect was management covariates recorded differently by year (plant density missing for every 2016
  field, planting date for 56% of 2017 fields, striga recorded only in 2020). The stable-baseline check below rules that out
  as the main cause: the baseline collapses on 2020 without those columns too. The cause is not identified. One untested
  explanation is a baseline that over-reads year-level weather and management differences from two to four years.
- **The gain is mostly within-year ranking, not year level.** After removing each held-out year's mean from observed and
  predicted yield, dR2 is +0.060 (survey-year, 4y), +0.057 (fixed-2019, 4y) and +0.040 (fixed-2019, 5y).
- **Year levels are still not predicted.** 2017 was a high-yield year (3,400 kg/ha vs about 3,000) and every model
  under-predicts it by 350-570 kg/ha. Total skill on an unseen year is low for every variant (R2 0.13-0.15).
- **2018 does not benefit** in any 4- or 5-year variant (contribution -0.001 each).
- **The nulls are wide here.** On four and five years the block-null p95 is +0.024 to +0.032, so shuffled embeddings sometimes "help"
  too. That is another sign the baseline is the unstable part. The real gains are 2 to 2.5 times the null p95.
- Survey-year and fixed-2019 imagery are now indistinguishable on four years (+0.064 vs +0.063), so the earlier advice to
  prefer fixed-year imagery rests on the 3-year test only. Ridge still disagrees with HGB for survey-year embeddings (-0.065).
- Caveats: 4-5 folds is still few, and the sign already flipped once when a year was added. Fixed-2019 imagery post-dates the
  2016-2018 harvests. About 30% of survey locations are approximated. One country.

### Stable-baseline check (`--baseline stable`, `out/loyo_more_years_stable.json`; 30 permutations per null)

Run after the result above, with its rule written first: is the gain an artefact of management covariates that are recorded
differently by year? The stable baseline keeps the env covariates and only the management columns with a similar missing
share in every year (N, P, K, lime, fert_in_hole, disease, pest, water_excess, hyb_type).

| Embedding variant | Survey years (folds) | Stable baseline | + emb | **dR2** | field / block null p95 | within-year dR2 |
|---|---|---|---|---|---|---|
| survey-year imagery | 2018-2020 (3) | 0.133 | 0.028 | **-0.104** | not run | -0.082 |
| fixed 2019 imagery | 2018-2020 (3) | 0.133 | 0.119 | **-0.013** | not run | -0.016 |
| survey-year imagery | 2017-2020 (4) | 0.066 | 0.122 | **+0.056** | +0.012 / +0.011 | +0.042 |
| fixed 2019 imagery | 2017-2020 (4) | 0.066 | 0.132 | **+0.066** | +0.008 / +0.028 | +0.040 |
| fixed 2019 imagery (primary) | 2016-2020 (5) | 0.082 | 0.128 | **+0.046** | +0.011 / +0.014 | +0.033 |

**Rule outcome: ROBUST_TO_BASELINE** (primary +0.046 is >= 0.02 and above both nulls).

- **The 4- and 5-year gain does not depend on the unevenly recorded management columns.** It is about the same size against
  the stable baseline (+0.046 to +0.066) as against the full one (+0.053 to +0.064), and above both nulls each time.
- **The baseline swings with the training years either way.** On 2020 the stable baseline goes from +0.057 (trained on
  2018-2019) to -0.076 (trained on 2017-2019), the same collapse as the full baseline. With fixed-2019 embeddings added the
  2020 fold stays above zero (+0.016, +0.031, +0.051 on 3, 4 and 5 years).
- **The 3-year results were sensitive to the baseline too.** Out of year, the stable baseline beats the full one on three
  years (0.133 vs 0.125), and against it fixed-2019 imagery is slightly negative (-0.013; it was +0.010 against the full
  baseline). The drift test's "fixed-year imagery recovers a small positive gain" does not survive this baseline.
- **2016 gets nothing** in the 5-year test (contribution 0.000; both models over-predict that low-yield year by 450-500
  kg/ha). Most of the 5-year gain comes from the 2019 and 2020 folds (+0.022 and +0.014).
- Fewer permutations here (30) than in the main run (100), so these null p95s are rougher.

## Suggested next steps

- **Find out why the baseline's out-of-year skill swings with the training years** (for example, drop the season-weather
  covariates, or test year-level features), because the embedding gain is measured against it. More survey years are the real
  fix, and this survey has none for Kenya after 2020.
- **Independent replication:** Rwanda and Tanzania have 2018-2020 fields in the same survey (tile discovery needed per country).
- Check whether the year offset tracks seasonal rainfall (regional effect) or is constant per year (product effect).
- Run the GitHub Actions workflow: it can only be started once `.github/workflows/aef-field-table.yml` is on `main`
  (GitHub refused a manual run from this branch: "workflow not found on the default branch").
- Steps 3-4 of the proposal (candidate generators, surprise ranking) only if the signal is judged worth pursuing.

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
