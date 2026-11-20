"""
Tightened version of baseline_vs_embedding.py (closes the loopholes listed in RESULTS.md).

Changes vs v1:
  * strongest baseline G1 = conventional covariates + MANAGEMENT (fertiliser, planting, weeding, pests...)
  * the size test and the null tests use the SAME model: HistGradientBoosting (primary). Ridge reported too.
  * permutation nulls (field-level and spatial-block) for HGB, not just ridge
  * harder splits: 0.25 deg blocks, 1.0 deg blocks (~110 km), and leave-one-year-out

Kinds: E1 env covariates | G1 = E1 + management | G2 = G1 + 64 embeddings | EMB = embeddings only. All with year dummies
(except under leave-one-year-out, where year cannot be a feature).

SUCCESS / KILL CRITERIA (fixed before running; written by the analyst, not yet reviewed by the project owner):
  primary statistic = HGB dR2 = R2(G2) - R2(G1), out of fold.
  configs: all/block0.25, all/block1.0, all/leave-one-year-out, excl-soil-missing/block0.25
  SUCCESS = in ALL four configs dR2 >= 0.02 AND dR2 > p95 of BOTH HGB nulls
  KILL    = in ALL four configs dR2 <= p95 of at least one HGB null
  MIXED   = anything else (e.g. above the nulls but under 0.02 somewhere)

usage: python baseline_tight.py SURVEY_CSV [--perms 30] [--emb TABLE] [--out JSON]
       --perms 0 gives point estimates only (no nulls, no verdict); used to compare embedding tables under one library version.
"""
import argparse, json, warnings
import numpy as np, pandas as pd, sklearn
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import RidgeCV
from sklearn.model_selection import GroupKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

warnings.filterwarnings("ignore")
ap = argparse.ArgumentParser(); ap.add_argument("csv"); ap.add_argument("--perms", type=int, default=30)
ap.add_argument("--emb", default="out/field_embeddings.parquet"); ap.add_argument("--out", default="out/baseline_tight_results.json")
a = ap.parse_args()

ENV = ["elev", "twi", "soil_rzpawhc", "soil_clay", "soil_pH", "soil_orgC", "soil_ECEC",
       "avg_season_gdd", "avg_season_ai", "avg_season_tavg", "season_prec", "season_prec_1", "season_prec_2", "season_prec_3"]
MG_NUM = ["N_kg_ha", "P_kg_ha", "K_kg_ha", "comp_kg_ha", "lime_kg_ha", "pl_m2", "plant_doy", "plant_date_dev"]
MG_CAT = ["compost", "manure", "fert_in_hole", "weeding", "pesticide", "disease", "pest", "striga", "water_excess", "hyb_type"]
EMB = [f"A{k:02d}" for k in range(64)]

raw = pd.read_csv(a.csv); raw["field_id"] = raw.index
df = raw.merge(pd.read_parquet(a.emb)[["field_id"] + EMB], on="field_id", how="inner")
df = df[df.yield_kg_ha.notna()].reset_index(drop=True)
for c in MG_CAT + ["cz", "year"]: df[c] = df[c].astype(str)
df["b025"] = np.floor(df.lon / 0.25).astype(int).astype(str) + "_" + np.floor(df.lat / 0.25).astype(int).astype(str)
df["b100"] = np.floor(df.lon / 1.0).astype(int).astype(str) + "_" + np.floor(df.lat / 1.0).astype(int).astype(str)
print(f"fields={len(df)} b025={df.b025.nunique()} b100={df.b100.nunique()}")


def design(kind, use_year):
    num = {"E1": ENV, "G1": ENV + MG_NUM, "G2": ENV + MG_NUM + EMB, "EMB": EMB}[kind]
    cat = (["year"] if use_year else []) + (["cz"] if kind != "EMB" else []) + (MG_CAT if kind in ("G1", "G2") else [])
    tr = []
    if cat: tr.append(("cat", OneHotEncoder(handle_unknown="ignore", min_frequency=20), cat))
    tr.append(("num", make_pipeline(SimpleImputer(strategy="median", add_indicator=False), StandardScaler()), num))
    return ColumnTransformer(tr)


def model(family, kind, use_year):
    est = RidgeCV(alphas=np.logspace(-1, 3, 9)) if family == "ridge" else \
        HistGradientBoostingRegressor(max_iter=300, learning_rate=0.05, max_leaf_nodes=15, l2_regularization=1.0, random_state=0)
    return make_pipeline(design(kind, use_year), est)


def oof_r2(family, kind, d, y, groups, use_year, repeats, seed=0):
    rng = np.random.RandomState(seed); res = []; ug = np.unique(groups)
    for _ in range(repeats):
        perm = dict(zip(ug, rng.permutation(len(ug)))); g = np.array([perm[x] for x in groups])
        pred = np.zeros(len(d))
        for tr, te in GroupKFold(min(5, len(ug))).split(d, y, g):
            pred[te] = model(family, kind, use_year).fit(d.iloc[tr], y[tr]).predict(d.iloc[te])
        res.append(1 - ((y - pred) ** 2).sum() / ((y - y.mean()) ** 2).sum())
    return float(np.mean(res))


def permute(d, rng, by_block, block_col):
    p = d.copy(); cols = [p.columns.get_loc(c) for c in EMB]
    for yr, idx in d.groupby("year").indices.items():
        sub = d.iloc[idx]
        if not by_block:
            p.iloc[idx, cols] = sub.iloc[rng.permutation(len(sub))][EMB].values; continue
        blocks = sub[block_col].unique(); mp = dict(zip(blocks, rng.permutation(blocks)))
        by = {b: np.where(sub[block_col].values == b)[0] for b in blocks}
        for i, b in enumerate(blocks):
            src = by[mp[b]] if (mp[b] != b or len(blocks) == 1) else by[blocks[(i + 1) % len(blocks)]]
            p.iloc[idx[by[b]], cols] = sub.iloc[rng.choice(src, size=len(by[b]))][EMB].values
    return p


CONFIGS = [("all/block0.25", None, "b025", True), ("all/block1.0", None, "b100", True),
           ("all/leave-one-year-out", None, "year", False), ("excl_soil/block0.25", "soil", "b025", True)]
results = {}
for name, filt, gcol, use_year in CONFIGS:
    d = (df[df.soil_clay.notna()] if filt == "soil" else df).reset_index(drop=True)
    y = d.yield_kg_ha.values; g = d[gcol].values; reps = 1 if gcol == "year" else 3
    r = {"n": len(d), "groups": int(d[gcol].nunique())}
    for fam in ("ridge", "hgb"):
        for k in ("E1", "G1", "G2", "EMB"):
            r[f"{fam}_{k}"] = oof_r2(fam, k, d, y, g, use_year, reps)
        r[f"{fam}_dR2_G2_minus_G1"] = r[f"{fam}_G2"] - r[f"{fam}_G1"]
    for tag, by_block in (("field", False), ("block", True)):
        if not a.perms: break
        rng = np.random.RandomState(1); null = []
        for i in range(a.perms):
            null.append(oof_r2("hgb", "G2", permute(d, rng, by_block, "b025" if gcol == "year" else gcol), y, g, use_year, 1, seed=i) - r["hgb_G1"])
        r[f"hgb_{tag}_null_p95"] = float(np.percentile(null, 95)); r[f"hgb_{tag}_null_mean"] = float(np.mean(null))
        r[f"hgb_above_{tag}_null"] = bool(r["hgb_dR2_G2_minus_G1"] > r[f"hgb_{tag}_null_p95"])
    results[name] = r
    print(name, json.dumps({k: (round(v, 4) if isinstance(v, float) else v) for k, v in r.items()}, indent=1), flush=True)

cfg = [v for v in results.values()]
if a.perms:
    succ = all(r["hgb_dR2_G2_minus_G1"] >= 0.02 and r["hgb_above_field_null"] and r["hgb_above_block_null"] for r in cfg)
    kill = all(not (r["hgb_above_field_null"] and r["hgb_above_block_null"]) for r in cfg)
    results["verdict"] = "SUCCESS" if succ else ("KILL" if kill else "MIXED")
else:
    results["verdict"] = "NOT_EVALUATED (point estimates only, --perms 0)"
results["sklearn"] = sklearn.__version__
print("VERDICT:", results["verdict"]); json.dump(results, open(a.out, "w"), indent=1)
