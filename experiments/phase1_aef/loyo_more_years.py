"""
Year-transfer test with more survey years (follow-up to drift_test.py and the fixed-year suite in RESULTS.md).

Why: with 3 years (2018-2020), fixed-2019 imagery gave a leave-one-year-out (LOYO) gain of +0.010 to +0.017: above the
nulls, under the 0.02 size bar. The survey also has Kenya fields for 2016 and 2017, and AlphaEarth starts in 2017, so
the test can have 4 or 5 folds instead of 3.

Inputs (build_field_table.py):
  out/field_embeddings.parquet               2018-2020 fields, each from its own survey year's imagery
  out/field_embeddings_ey2017_y2017.parquet  2017 fields from 2017 imagery            (--years 2017)
  out/field_embeddings_ey2019.parquet        2018-2020 fields from 2019 imagery       (--embed-year 2019)
  out/field_embeddings_ey2019_y1617.parquet  2016-2017 fields from 2019 imagery       (--years 2016 2017 --embed-year 2019)

Variants (HGB, baseline G1 = env + management, no year feature; dR2 = R2(G1 + emb) - R2(G1), pooled out of fold)
  own_4y     : survey-year embeddings, 2017-2020 (4 folds). 2016 has no imagery, so it cannot be included.
  ref2019_4y : every field from 2019 imagery, the same 2017-2020 fields (like-for-like with own_4y)
  ref2019_5y : every field from 2019 imagery, 2016-2020 (5 folds)                     <- primary
  own_3y, ref2019_3y : 2018-2020 only, no nulls; a check against the earlier numbers (-0.077; +0.010 / +0.017)
Nulls per variant, as in baseline_tight.py: field-level shuffle and spatial-block shuffle of the embeddings within year
(the block null gives every field the embedding of a random field in another 0.25 deg block), --perms each.

HGB runs single-threaded (parallelism is across permutations) so that thread-order rounding cannot move the numbers.

PRE-SET DECISION RULES (written before any result of this script existed; analyst-set, not reviewed by the project owner)
  primary = ref2019_5y
  TRANSFER_HOLDS : primary dR2 >= 0.02 and above both null p95s, AND ref2019_4y dR2 > 0 and above both of its null p95s
  TRANSFER_FAILS : primary dR2 <= the p95 of at least one of its nulls
  TRANSFER_SMALL : anything else (above the nulls but under 0.02, or the 4-year check fails)
  Separately: OWN_YEAR_FAILS_AGAIN if own_4y dR2 < 0 or it is not above both of its nulls.
  Reported but not part of the rule: each held-out year's contribution to dR2 (the contributions sum to the pooled dR2),
  and ridge dR2.

POST HOC (added after the first results of this script were seen; descriptive, not part of the rule)
  per held-out year: R2 of G1 and of G2 against that year's own mean yield, and the mean error (bias) of each;
  hgb_dR2_within_year: dR2 after removing each held-out year's mean from observed and predicted yield, i.e. skill at
  ranking fields inside an unseen year with no credit for predicting that year's overall level.
  --perms 0 writes these without nulls or a verdict (out/loyo_more_years_diag.json).

STABLE-BASELINE CHECK (--baseline stable; added 2026-11-20 after the main result showed the full baseline G1 getting
worse when more years are pooled. The rule below was written before this check was run.)
  The stable baseline keeps env covariates and only the management columns whose missing share differs by < 0.10 between
  any two survey years 2016-2020: N, P, K, lime (kg/ha), fert_in_hole, disease, pest, water_excess, hyb_type.
  Dropped: comp_kg_ha, pl_m2, plant_doy, plant_date_dev, compost, manure, weeding, pesticide, striga.
  ROBUST_TO_BASELINE     : ref2019_5y dR2 over the stable baseline >= 0.02 and above both of its null p95s
  NOT_ROBUST_TO_BASELINE : otherwise (the gain over G1 is then attributed mainly to the unstable baseline)

usage: python loyo_more_years.py SURVEY_CSV [--perms 30] [--jobs 10] [--out JSON] [--baseline full|stable]
"""
import os
os.environ.setdefault("OMP_NUM_THREADS", "1")
import argparse, json, warnings
import numpy as np, pandas as pd
from joblib import Parallel, delayed
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import RidgeCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

warnings.filterwarnings("ignore")

ENV = ["elev", "twi", "soil_rzpawhc", "soil_clay", "soil_pH", "soil_orgC", "soil_ECEC",
       "avg_season_gdd", "avg_season_ai", "avg_season_tavg", "season_prec", "season_prec_1", "season_prec_2", "season_prec_3"]
MG_NUM = ["N_kg_ha", "P_kg_ha", "K_kg_ha", "comp_kg_ha", "lime_kg_ha", "pl_m2", "plant_doy", "plant_date_dev"]
MG_CAT = ["compost", "manure", "fert_in_hole", "weeding", "pesticide", "disease", "pest", "striga", "water_excess", "hyb_type"]
EMB = [f"A{k:02d}" for k in range(64)]
FULL = (MG_NUM, MG_CAT)
STABLE = (["N_kg_ha", "P_kg_ha", "K_kg_ha", "lime_kg_ha"], ["fert_in_hole", "disease", "pest", "water_excess", "hyb_type"])


def design(emb, base=FULL):
    return ColumnTransformer([("cat", OneHotEncoder(handle_unknown="ignore", min_frequency=20), ["cz"] + base[1]),
                              ("num", make_pipeline(SimpleImputer(strategy="median"), StandardScaler()), ENV + base[0] + emb)])


def estimator(family):
    if family == "ridge": return RidgeCV(alphas=np.logspace(-1, 3, 9))
    return HistGradientBoostingRegressor(max_iter=300, learning_rate=0.05, max_leaf_nodes=15, l2_regularization=1.0, random_state=0)


def loyo_pred(d, emb, family="hgb", base=FULL):
    y = d.yield_kg_ha.values; pred = np.zeros(len(d))
    for yr in sorted(d.year.unique()):
        te = (d.year == yr).values; tr = ~te
        pred[te] = make_pipeline(design(emb, base), estimator(family)).fit(d[tr], y[tr]).predict(d[te])
    return pred


def r2(y, pred): return float(1 - ((y - pred) ** 2).sum() / ((y - y.mean()) ** 2).sum())


def permute(d, rng, by_block):
    p = d.copy(); cols = [p.columns.get_loc(c) for c in EMB]
    for yr, idx in d.groupby("year").indices.items():
        sub = d.iloc[idx]
        if not by_block:
            p.iloc[idx, cols] = sub.iloc[rng.permutation(len(sub))][EMB].values; continue
        blocks = sub.b025.unique(); mp = dict(zip(blocks, rng.permutation(blocks)))
        by = {b: np.where(sub.b025.values == b)[0] for b in blocks}
        for i, b in enumerate(blocks):
            src = by[mp[b]] if (mp[b] != b or len(blocks) == 1) else by[blocks[(i + 1) % len(blocks)]]
            p.iloc[idx[by[b]], cols] = sub.iloc[rng.choice(src, size=len(by[b]))][EMB].values
    return p


def null_run(d, by_block, seed, base=FULL):
    return r2(d.yield_kg_ha.values, loyo_pred(permute(d, np.random.RandomState(seed), by_block), EMB, "hgb", base))


def table(raw, paths, years):
    emb = pd.concat([pd.read_parquet(p)[["field_id"] + EMB] for p in paths], ignore_index=True)
    assert emb.field_id.is_unique, "a field appears in two embedding tables"
    d = raw.merge(emb, on="field_id", how="inner")
    d = d[(d.country == "kenya") & d.year.isin(years) & d.yield_kg_ha.notna()].reset_index(drop=True)
    for c in MG_CAT + ["cz"]: d[c] = d[c].astype(str)
    d["year"] = d.year.astype(int)
    d["b025"] = np.floor(d.lon / 0.25).astype(int).astype(str) + "_" + np.floor(d.lat / 0.25).astype(int).astype(str)
    return d


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("csv"); ap.add_argument("--perms", type=int, default=30)
    ap.add_argument("--jobs", type=int, default=10); ap.add_argument("--out", default="out/loyo_more_years_results.json")
    ap.add_argument("--baseline", choices=["full", "stable"], default="full")
    a = ap.parse_args(); base = STABLE if a.baseline == "stable" else FULL
    raw = pd.read_csv(a.csv); raw["field_id"] = raw.index
    own = table(raw, ["out/field_embeddings.parquet", "out/field_embeddings_ey2017_y2017.parquet"], [2017, 2018, 2019, 2020])
    ref = table(raw, ["out/field_embeddings_ey2019.parquet", "out/field_embeddings_ey2019_y1617.parquet"], [2016, 2017, 2018, 2019, 2020])
    sub = lambda d, yrs: d[d.year.isin(yrs)].reset_index(drop=True)
    variants = {"own_3y": (sub(own, [2018, 2019, 2020]), False), "ref2019_3y": (sub(ref, [2018, 2019, 2020]), False),
                "own_4y": (own, True), "ref2019_4y": (sub(ref, [2017, 2018, 2019, 2020]), True), "ref2019_5y": (ref, True)}
    assert set(variants["own_4y"][0].field_id) == set(variants["ref2019_4y"][0].field_id), "own_4y and ref2019_4y differ in fields"
    import sklearn
    out = {"perms": a.perms, "sklearn": sklearn.__version__, "baseline": a.baseline}
    for name, (d, with_nulls) in variants.items():
        y = d.yield_kg_ha.values; sst = ((y - y.mean()) ** 2).sum()
        p1, p2 = loyo_pred(d, [], "hgb", base), loyo_pred(d, EMB, "hgb", base)
        r = {"n": int(len(d)), "by_year": {int(k): int(v) for k, v in d.year.value_counts().sort_index().items()},
             "no_valid_embedding": int(d.A00.isna().sum()), "hgb_G1": r2(y, p1), "hgb_G2": r2(y, p2)}
        r["hgb_dR2"] = r["hgb_G2"] - r["hgb_G1"]
        r["ridge_dR2"] = r2(y, loyo_pred(d, EMB, "ridge", base)) - r2(y, loyo_pred(d, [], "ridge", base))
        r["dR2_by_held_out_year"] = {int(yr): float((((y - p1) ** 2)[d.year == yr].sum() - ((y - p2) ** 2)[d.year == yr].sum()) / sst)
                                     for yr in sorted(d.year.unique())}
        ym = d.groupby("year").yield_kg_ha.transform("mean").values
        def within(pred):
            pc = pred - pd.Series(pred).groupby(d.year.values).transform("mean").values
            return float(1 - (((y - ym) - pc) ** 2).sum() / ((y - ym) ** 2).sum())
        r["hgb_dR2_within_year"] = within(p2) - within(p1)
        r["held_out_year_detail"] = {int(yr): {
            "r2_G1": float(1 - ((y - p1) ** 2)[m].sum() / ((y - ym) ** 2)[m].sum()), "r2_G2": float(1 - ((y - p2) ** 2)[m].sum() / ((y - ym) ** 2)[m].sum()),
            "bias_G1_kg_ha": float((p1 - y)[m].mean()), "bias_G2_kg_ha": float((p2 - y)[m].mean()), "mean_yield_kg_ha": float(y[m].mean())}
            for yr in sorted(d.year.unique()) for m in [(d.year == yr).values]}
        if with_nulls and a.perms:
            for tag, by_block in (("field", False), ("block", True)):
                vals = Parallel(n_jobs=a.jobs)(delayed(null_run)(d, by_block, 1000 * by_block + i, base) for i in range(a.perms))
                null = np.array(vals) - r["hgb_G1"]
                r[f"{tag}_null_p95"] = float(np.percentile(null, 95)); r[f"{tag}_null_mean"] = float(null.mean())
                r[f"above_{tag}_null"] = bool(r["hgb_dR2"] > r[f"{tag}_null_p95"])
            r["above_both_nulls"] = bool(r["above_field_null"] and r["above_block_null"])
        out[name] = r
        print(name, json.dumps({k: (round(v, 4) if isinstance(v, float) else v) for k, v in r.items()}), flush=True)

    if not a.perms:
        json.dump(out, open(a.out, "w"), indent=1); print("no nulls requested: wrote diagnostics only"); raise SystemExit(0)
    p, c4, o4 = out["ref2019_5y"], out["ref2019_4y"], out["own_4y"]
    if p["hgb_dR2"] >= 0.02 and p["above_both_nulls"] and c4["hgb_dR2"] > 0 and c4["above_both_nulls"]: verdict = "TRANSFER_HOLDS"
    elif not p["above_both_nulls"]: verdict = "TRANSFER_FAILS"
    else: verdict = "TRANSFER_SMALL"
    out["verdict"] = verdict
    if a.baseline == "stable":
        out["baseline_check"] = "ROBUST_TO_BASELINE" if (p["hgb_dR2"] >= 0.02 and p["above_both_nulls"]) else "NOT_ROBUST_TO_BASELINE"
        print("BASELINE CHECK:", out["baseline_check"])
    out["own_year_fails_again"] = bool(o4["hgb_dR2"] < 0 or not o4["above_both_nulls"])
    print("VERDICT:", verdict, "| own-year fails again:", out["own_year_fails_again"])
    json.dump(out, open(a.out, "w"), indent=1)
