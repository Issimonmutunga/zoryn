# Phase 1, step 2: do embeddings add to conventional covariates? (yield, Kenya 2018-2020)

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
