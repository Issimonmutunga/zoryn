"""
Step 2/5 of the first experiment (proposal s5, s10.7): do AlphaEarth neighbourhood embeddings predict
held-out maize yield BEYOND conventional environmental covariates?

Models (all include year dummies):
  M0  year only
  M1  conventional ("predicate") covariates: elevation, TWI, soils, season climate/weather, climate zone
  M2  M1 + 64 embedding dims          <- the question
  M3  embeddings only (+ year)

Validation: spatial block CV (0.25 deg blocks ~ 28 km; whole blocks held out), 3 repeats x 5 folds.
Nulls (ridge, 100x each):
  field null : permute embedding rows across fields WITHIN year (breaks the field link; easy to beat)
  block null : within year, give every field the embedding of a random field from a DIFFERENT random block
               (keeps the spatial smoothness of the embeddings, breaks the link to local yield) - the
               spatial-block permutation null of proposal s5. Added after a 5-permutation smoke run
               showed the field null is weak; success now requires clearing BOTH.
Run twice: all fields, and excluding soil-missing rows (proposal s10.6 location-quality mitigation).

SUCCESS / KILL CRITERIA (fixed before running; set by the analyst, not yet reviewed by the project owner):
  success = for at least one model family, dR2(M2-M1) >= 0.02 AND, for ridge, the real dR2 exceeds the
            95th percentile of BOTH nulls, in BOTH analyses.
  kill    = dR2(M2-M1) inside the null range in both analyses  -> embeddings add nothing here.

usage: python baseline_vs_embedding.py SURVEY_CSV [--perms 100]
"""
import argparse, json, warnings
import numpy as np, pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import RidgeCV
from sklearn.model_selection import GroupKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

warnings.filterwarnings("ignore")
ap = argparse.ArgumentParser(); ap.add_argument("csv"); ap.add_argument("--perms", type=int, default=100)
ap.add_argument("--emb", default="out/field_embeddings.parquet"); ap.add_argument("--out", default="out/baseline_results.json")
a = ap.parse_args()

NUM = ["elev", "twi", "soil_rzpawhc", "soil_clay", "soil_pH", "soil_orgC", "soil_ECEC",
       "avg_season_gdd", "avg_season_ai", "avg_season_tavg", "season_prec", "season_prec_1", "season_prec_2", "season_prec_3"]
EMB = [f"A{k:02d}" for k in range(64)]

raw = pd.read_csv(a.csv); raw["field_id"] = raw.index
e = pd.read_parquet(a.emb)[["field_id"] + EMB]
df = raw.merge(e, on="field_id", how="inner")
df = df[df.yield_kg_ha.notna()].reset_index(drop=True)
df["block"] = (np.floor(df.lon / 0.25).astype(int).astype(str) + "_" + np.floor(df.lat / 0.25).astype(int).astype(str))
df["cz"] = df.cz.astype(str); df["year"] = df.year.astype(str)
y = df.yield_kg_ha.values
print(f"fields={len(df)} blocks={df.block.nunique()} years={sorted(df.year.unique())}")


def design(kind, d):
    num = {"M0": [], "M1": NUM, "M2": NUM + EMB, "M3": EMB}[kind]
    cat = ["year"] + (["cz"] if kind in ("M1", "M2") else [])
    tr = [("cat", OneHotEncoder(handle_unknown="ignore"), cat)]
    if num: tr.append(("num", make_pipeline(SimpleImputer(strategy="median"), StandardScaler()), num))
    return ColumnTransformer(tr)


def model(family, kind, d):
    est = RidgeCV(alphas=np.logspace(-1, 3, 9)) if family == "ridge" else \
        HistGradientBoostingRegressor(max_iter=300, learning_rate=0.05, max_leaf_nodes=15, l2_regularization=1.0, random_state=0)
    return make_pipeline(design(kind, d), est)


def oof_r2(family, kind, d, y, groups, repeats=3, seed=0):
    rng = np.random.RandomState(seed); res = []
    ug = np.unique(groups)
    for _ in range(repeats):
        perm = dict(zip(ug, rng.permutation(len(ug))))           # randomise block->fold assignment
        g = np.array([perm[x] for x in groups])
        pred = np.zeros(len(d))
        for tr, te in GroupKFold(5).split(d, y, g):
            m = model(family, kind, d).fit(d.iloc[tr], y[tr]); pred[te] = m.predict(d.iloc[te])
        res.append(1 - ((y - pred) ** 2).sum() / ((y - y.mean()) ** 2).sum())
    return float(np.mean(res)), [float(x) for x in res]


def permute_within_year(d, rng):
    p = d.copy()
    for yr, idx in d.groupby("year").indices.items():
        p.iloc[idx, [p.columns.get_loc(c) for c in EMB]] = d.iloc[rng.permutation(idx)][EMB].values
    return p


def permute_blocks(d, rng):
    p = d.copy(); cols = [p.columns.get_loc(c) for c in EMB]
    for yr, idx in d.groupby("year").indices.items():
        sub = d.iloc[idx]; blocks = sub.block.unique(); perm = dict(zip(blocks, rng.permutation(blocks)))
        by = {b: np.where(sub.block.values == b)[0] for b in blocks}
        for b in blocks:
            src = by[perm[b]]
            if perm[b] == b and len(blocks) > 1:       # avoid identity
                src = by[blocks[(list(blocks).index(b) + 1) % len(blocks)]]
            draw = rng.choice(src, size=len(by[b]))
            p.iloc[idx[by[b]], cols] = sub.iloc[draw][EMB].values
    return p


results = {}
for name, sub in (("all_fields", df), ("excl_soil_missing", df[df.soil_clay.notna()])):
    d = sub.reset_index(drop=True); yy = d.yield_kg_ha.values; g = d.block.values
    r = {"n": len(d), "blocks": int(d.block.nunique())}
    for fam in ("ridge", "hgb"):
        for k in ("M0", "M1", "M2", "M3"):
            r[f"{fam}_{k}"], _ = oof_r2(fam, k, d, yy, g)
        r[f"{fam}_dR2_M2_minus_M1"] = r[f"{fam}_M2"] - r[f"{fam}_M1"]
    for tag, fn in (("field", permute_within_year), ("block", permute_blocks)):
        rng = np.random.RandomState(1); null = []
        for i in range(a.perms):
            null.append(oof_r2("ridge", "M2", fn(d, rng), yy, g, repeats=1, seed=i)[0] - r["ridge_M1"])
        r[f"ridge_{tag}_null_dR2_mean"] = float(np.mean(null)); r[f"ridge_{tag}_null_dR2_p95"] = float(np.percentile(null, 95))
        r[f"ridge_{tag}_null_dR2_max"] = float(np.max(null))
        r[f"ridge_above_{tag}_null_p95"] = bool(r["ridge_dR2_M2_minus_M1"] > r[f"ridge_{tag}_null_dR2_p95"])
    r["ridge_real_above_null_p95"] = r["ridge_above_field_null_p95"] and r["ridge_above_block_null_p95"]
    results[name] = r
    print(name, json.dumps({k: (round(v, 4) if isinstance(v, float) else v) for k, v in r.items()}, indent=1))

ok = all((max(r["ridge_dR2_M2_minus_M1"], r["hgb_dR2_M2_minus_M1"]) >= 0.02) and r["ridge_real_above_null_p95"] for r in results.values())
kill = all(not r["ridge_real_above_null_p95"] and max(r["ridge_dR2_M2_minus_M1"], r["hgb_dR2_M2_minus_M1"]) < 0.02 for r in results.values())
results["verdict"] = "SUCCESS" if ok else ("KILL" if kill else "INCONCLUSIVE (between criteria)")
print("VERDICT:", results["verdict"])
json.dump(results, open(a.out, "w"), indent=1)
