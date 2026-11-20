"""
Why did embeddings fail leave-one-year-out (LOYO)?  Drift (year-specific embedding values) or composition
(different sites surveyed each year)?

Inputs: out/field_embeddings.parquet (each field's embedding from ITS survey year) and
        out/field_embeddings_ey{2018,2019,2020}.parquet (EVERY field sampled from that one year).

Diagnostics
  D1  same-site cross-year cosine vs random-pair cosine; paired mean shift between years / between-field spread
  D2  year identifiability: logistic regression predicting survey year from embeddings (0.25 deg block CV).
      own-year embeddings vs fixed-reference-year embeddings. If only own-year embeddings reveal the year => drift.
LOYO tests (HGB, baseline G1 = env + management, no year feature; dR2 = R2(G1+emb) - R2(G1))
  own        : survey-year embeddings                       (reproduces the failure)
  ref2018/19/20 : every field uses the same reference year  (removes year-specific embedding values)
  own_centred: survey-year embeddings standardised within each year (removes year mean/scale shift)
  Null per variant: 20 spatial-block permutations (embeddings from a random other 0.25 deg block, within year).

PRE-SET DECISION RULES (written before any result existed; analyst-set, not reviewed by the project owner)
  DRIFT       : own dR2 < 0 AND at least 2 of the 3 ref-year variants have dR2 > 0 and > their null p95
  COMPOSITION : none of the ref-year variants nor own_centred has dR2 > its null p95  (failure is not about
                year-specific embedding values; it is sites/yield changing between years)
  PARTIAL     : anything else.   Separately report whether own_centred alone fixes it (mean/scale shift).

usage: python drift_test.py SURVEY_CSV [--perms 20]
"""
import argparse, json, warnings
import numpy as np, pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression, RidgeCV
from sklearn.model_selection import GroupKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

warnings.filterwarnings("ignore")
ap = argparse.ArgumentParser(); ap.add_argument("csv"); ap.add_argument("--perms", type=int, default=20)
ap.add_argument("--out", default="out/drift_results.json"); a = ap.parse_args()

ENV = ["elev", "twi", "soil_rzpawhc", "soil_clay", "soil_pH", "soil_orgC", "soil_ECEC",
       "avg_season_gdd", "avg_season_ai", "avg_season_tavg", "season_prec", "season_prec_1", "season_prec_2", "season_prec_3"]
MG_NUM = ["N_kg_ha", "P_kg_ha", "K_kg_ha", "comp_kg_ha", "lime_kg_ha", "pl_m2", "plant_doy", "plant_date_dev"]
MG_CAT = ["compost", "manure", "fert_in_hole", "weeding", "pesticide", "disease", "pest", "striga", "water_excess", "hyb_type"]
EMB = [f"A{k:02d}" for k in range(64)]

raw = pd.read_csv(a.csv); raw["field_id"] = raw.index
def load(path, tag): return pd.read_parquet(path)[["field_id"] + EMB].rename(columns={c: f"{tag}_{c}" for c in EMB})
df = raw
for path, tag in (("out/field_embeddings.parquet", "own"), ("out/field_embeddings_ey2018.parquet", "r2018"),
                  ("out/field_embeddings_ey2019.parquet", "r2019"), ("out/field_embeddings_ey2020.parquet", "r2020")):
    df = df.merge(load(path, tag), on="field_id", how="inner")
df = df[df.yield_kg_ha.notna()].reset_index(drop=True)
for c in MG_CAT + ["cz"]: df[c] = df[c].astype(str)
df["year"] = df.year.astype(int); df["b025"] = np.floor(df.lon / 0.25).astype(int).astype(str) + "_" + np.floor(df.lat / 0.25).astype(int).astype(str)
cols = lambda tag: [f"{tag}_{c}" for c in EMB]
# own-year embeddings standardised within each survey year
for c in cols("own"): df[c.replace("own_", "cen_")] = df.groupby("year")[c].transform(lambda s: (s - s.mean()) / (s.std() + 1e-9))
print(f"fields={len(df)} by year={df.year.value_counts().sort_index().to_dict()}")
out = {}

# ---------------- D1: drift magnitude ----------------
def cos(A, B): return (A * B).sum(1) / (np.linalg.norm(A, axis=1) * np.linalg.norm(B, axis=1))
d1 = {}
rng = np.random.RandomState(0)
for y1, y2 in ((2018, 2019), (2019, 2020), (2018, 2020)):
    A, B = df[cols(f"r{y1}")].values, df[cols(f"r{y2}")].values
    rp = rng.permutation(len(df))
    d1[f"{y1}_vs_{y2}"] = {"same_site_cos": float(cos(A, B).mean()), "random_pair_cos_same_year": float(cos(A, A[rp]).mean()),
                           "mean_shift_over_between_field_sd": float(np.linalg.norm((A - B).mean(0)) / np.sqrt((A.std(0) ** 2).sum()))}
out["D1_drift"] = d1; print("D1", json.dumps(d1, indent=1))

# ---------------- D2: year identifiability ----------------
def year_acc(tag):
    X = df[cols(tag)].values; y = df.year.values; g = df.b025.values; pred = np.empty(len(df), int)
    for tr, te in GroupKFold(5).split(X, y, g):
        m = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000, C=0.5)).fit(X[tr], y[tr]); pred[te] = m.predict(X[te])
    return float((pred == y).mean())
d2 = {"majority_class": float(df.year.value_counts(normalize=True).max())}
for tag in ("own", "r2018", "r2019", "r2020"): d2[tag] = year_acc(tag)
out["D2_year_identifiability"] = d2; print("D2", d2)

# ---------------- LOYO tests ----------------
def design(emb):
    num = ENV + MG_NUM + emb
    return ColumnTransformer([("cat", OneHotEncoder(handle_unknown="ignore", min_frequency=20), ["cz"] + MG_CAT),
                              ("num", make_pipeline(SimpleImputer(strategy="median"), StandardScaler()), num)])
def hgb(): return HistGradientBoostingRegressor(max_iter=300, learning_rate=0.05, max_leaf_nodes=15, l2_regularization=1.0, random_state=0)
def loyo(d, emb, family="hgb"):
    y = d.yield_kg_ha.values; pred = np.zeros(len(d))
    for yr in sorted(d.year.unique()):
        te = (d.year == yr).values; tr = ~te
        est = hgb() if family == "hgb" else RidgeCV(alphas=np.logspace(-1, 3, 9))
        pred[te] = make_pipeline(design(emb), est).fit(d[tr], y[tr]).predict(d[te])
    return 1 - ((y - pred) ** 2).sum() / ((y - y.mean()) ** 2).sum()
def block_perm(d, emb, rng):
    p = d.copy(); ci = [p.columns.get_loc(c) for c in emb]
    for yr, idx in d.groupby("year").indices.items():
        sub = d.iloc[idx]; blocks = sub.b025.unique(); mp = dict(zip(blocks, rng.permutation(blocks)))
        by = {b: np.where(sub.b025.values == b)[0] for b in blocks}
        for i, b in enumerate(blocks):
            src = by[mp[b]] if (mp[b] != b or len(blocks) == 1) else by[blocks[(i + 1) % len(blocks)]]
            p.iloc[idx[by[b]], ci] = sub.iloc[rng.choice(src, size=len(by[b]))][emb].values
    return p

g1 = loyo(df, []); g1r = loyo(df, [], "ridge"); out["G1_hgb"] = float(g1); print("G1 (no embeddings) LOYO HGB", round(g1, 4))
variants = {"own": cols("own"), "ref2018": cols("r2018"), "ref2019": cols("r2019"), "ref2020": cols("r2020"), "own_centred": [c.replace("own_", "cen_") for c in cols("own")]}
res = {}
for name, emb in variants.items():
    r2 = loyo(df, emb); rr = loyo(df, emb, "ridge") - g1r
    rng = np.random.RandomState(1); null = [loyo(block_perm(df, emb, rng), emb) - g1 for _ in range(a.perms)]
    res[name] = {"hgb_G2": float(r2), "hgb_dR2": float(r2 - g1), "ridge_dR2": float(rr), "null_p95": float(np.percentile(null, 95)),
                 "above_null": bool(r2 - g1 > np.percentile(null, 95)), "per_year_note": "LOYO, 3 folds"}
    print(name, {k: (round(v, 4) if isinstance(v, float) else v) for k, v in res[name].items()}, flush=True)
out["LOYO"] = res

ref_ok = sum(res[k]["hgb_dR2"] > 0 and res[k]["above_null"] for k in ("ref2018", "ref2019", "ref2020"))
if res["own"]["hgb_dR2"] < 0 and ref_ok >= 2: verdict = "DRIFT"
elif not any(res[k]["above_null"] for k in ("ref2018", "ref2019", "ref2020", "own_centred")): verdict = "COMPOSITION"
else: verdict = "PARTIAL"
out["verdict"] = verdict; out["centring_alone_fixes"] = bool(res["own_centred"]["above_null"] and res["own_centred"]["hgb_dR2"] > 0)
print("VERDICT:", verdict, "| centring alone fixes:", out["centring_alone_fixes"]); json.dump(out, open(a.out, "w"), indent=1)
