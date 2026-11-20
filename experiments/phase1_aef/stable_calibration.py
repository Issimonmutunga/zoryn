"""
Stable-land drift calibration: is the year shift in AlphaEarth embeddings a product-level offset, or real change?

Inputs
  out/stable_sites.csv                    homogeneous tree / water / built-up patches (select_stable_sites.py)
  out/stable_ey{2018,2019,2020}.parquet   AlphaEarth 7x7 level-4 means at those sites for each year
  out/field_embeddings_ey{...}.parquet    the survey fields sampled from each year (drift_test.py inputs)

S1  stable-land shift between years: same-site cosine and mean shift / between-site spread, per class
S2  direction: cosine between the stable-land shift vector and the cropland (field) shift vector, per year pair
S3  calibration: estimate a per-year offset from STABLE SITES ONLY (pooled classes, reference year 2019), subtract it from each
    field's survey-year embedding, re-run leave-one-year-out (HGB, gain over env+management baseline) with 20 block nulls.

PRE-SET DECISION RULES (fixed before any result existed; analyst-set, not reviewed by the project owner)
  PRODUCT_OFFSET   : mean cosine(stable shift, field shift) >= 0.7 over the 3 year pairs AND stable shift magnitude >= 0.5x the
                     field shift magnitude AND calibrated LOYO dR2 > its null p95 AND calibrated dR2 >= uncalibrated dR2 + 0.03
                     (a common-mode offset that stable land can remove)
  LAND_SURFACE_REAL: stable shift magnitude < 0.3x the field shift magnitude OR mean cosine < 0.3
                     (stable land does not move like cropland; not removable by stable-land calibration)
  PARTIAL          : anything else
"""
import argparse, json, warnings
import numpy as np, pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

warnings.filterwarnings("ignore")
ap = argparse.ArgumentParser(); ap.add_argument("csv"); ap.add_argument("--perms", type=int, default=20)
ap.add_argument("--out", default="out/stable_calibration_results.json"); a = ap.parse_args()
EMB = [f"A{k:02d}" for k in range(64)]
YEARS = (2018, 2019, 2020)

sites = pd.read_csv("out/stable_sites.csv"); sites["field_id"] = sites.index
S = {}
for y in YEARS:
    t = pd.read_parquet(f"out/stable_ey{y}.parquet")[["field_id"] + EMB]
    S[y] = sites[["field_id", "cls"]].merge(t, on="field_id", how="inner")
ok = set.intersection(*[set(S[y].dropna(subset=EMB).field_id) for y in YEARS])
for y in YEARS: S[y] = S[y][S[y].field_id.isin(ok)].sort_values("field_id").reset_index(drop=True)
print("stable sites with valid embeddings in all years:", S[2019].cls.value_counts().to_dict(), "of", len(sites))
cls = S[2019].cls.values

raw = pd.read_csv(a.csv); raw["field_id"] = raw.index
F = {y: pd.read_parquet(f"out/field_embeddings_ey{y}.parquet")[["field_id"] + EMB].sort_values("field_id").reset_index(drop=True) for y in YEARS}
cosv = lambda u, v: float(u @ v / (np.linalg.norm(u) * np.linalg.norm(v)))
out = {"n_sites": {k: int(v) for k, v in pd.Series(cls).value_counts().items()}}

# ---- S1 / S2
s12 = {}
for y1, y2 in ((2018, 2019), (2019, 2020), (2018, 2020)):
    A, B = S[y1][EMB].values, S[y2][EMB].values
    fA, fB = F[y1][EMB].values, F[y2][EMB].values
    per_class = {}
    shifts = []
    for c in ("tree", "water", "built"):
        m = cls == c
        if m.sum() < 5: continue
        d = (B[m] - A[m]).mean(0); shifts.append(d)
        sd = np.sqrt((A[m].std(0) ** 2).sum())
        sc = (A[m] * B[m]).sum(1) / (np.linalg.norm(A[m], axis=1) * np.linalg.norm(B[m], axis=1))
        per_class[c] = {"n": int(m.sum()), "same_site_cos": float(sc.mean()), "shift_over_between_site_sd": float(np.linalg.norm(d) / sd)}
    stable_shift = np.mean(shifts, axis=0)                       # equal weight per class
    field_shift = (fB - fA).mean(0)
    s12[f"{y1}_to_{y2}"] = {"per_class": per_class, "stable_shift_norm": float(np.linalg.norm(stable_shift)),
                            "field_shift_norm": float(np.linalg.norm(field_shift)),
                            "magnitude_ratio_stable_over_field": float(np.linalg.norm(stable_shift) / np.linalg.norm(field_shift)),
                            "cos_stable_vs_field_shift": cosv(stable_shift, field_shift),
                            "cos_between_class_shifts": {f"{i}-{j}": cosv(shifts[i], shifts[j]) for i in range(len(shifts)) for j in range(i + 1, len(shifts))}}
    print(y1, y2, json.dumps(s12[f"{y1}_to_{y2}"], indent=1))
out["S1_S2"] = s12
mean_cos = float(np.mean([v["cos_stable_vs_field_shift"] for v in s12.values()]))
mean_ratio = float(np.mean([v["magnitude_ratio_stable_over_field"] for v in s12.values()]))

# ---- S3 calibration in LOYO
def class_mean(y):
    X = S[y][EMB].values; return np.mean([X[cls == c].mean(0) for c in ("tree", "water", "built") if (cls == c).sum() >= 5], axis=0)
ref = class_mean(2019); offset = {y: class_mean(y) - ref for y in YEARS}          # stable-site-only offsets

ENV = ["elev", "twi", "soil_rzpawhc", "soil_clay", "soil_pH", "soil_orgC", "soil_ECEC", "avg_season_gdd", "avg_season_ai",
       "avg_season_tavg", "season_prec", "season_prec_1", "season_prec_2", "season_prec_3"]
MG_NUM = ["N_kg_ha", "P_kg_ha", "K_kg_ha", "comp_kg_ha", "lime_kg_ha", "pl_m2", "plant_doy", "plant_date_dev"]
MG_CAT = ["compost", "manure", "fert_in_hole", "weeding", "pesticide", "disease", "pest", "striga", "water_excess", "hyb_type"]
own = pd.read_parquet("out/field_embeddings.parquet")[["field_id"] + EMB]
df = raw.merge(own, on="field_id", how="inner"); df = df[df.yield_kg_ha.notna()].reset_index(drop=True)
for c in MG_CAT + ["cz"]: df[c] = df[c].astype(str)
df["year"] = df.year.astype(int); df["b025"] = np.floor(df.lon / .25).astype(int).astype(str) + "_" + np.floor(df.lat / .25).astype(int).astype(str)
CAL = [f"cal_{c}" for c in EMB]
for y in YEARS:
    m = (df.year == y).values; df.loc[m, CAL] = df.loc[m, EMB].values - offset[y]

def design(emb):
    return ColumnTransformer([("cat", OneHotEncoder(handle_unknown="ignore", min_frequency=20), ["cz"] + MG_CAT),
                              ("num", make_pipeline(SimpleImputer(strategy="median"), StandardScaler()), ENV + MG_NUM + emb)])
def loyo(d, emb):
    y = d.yield_kg_ha.values; pred = np.zeros(len(d))
    for yr in YEARS:
        te = (d.year == yr).values
        est = HistGradientBoostingRegressor(max_iter=300, learning_rate=0.05, max_leaf_nodes=15, l2_regularization=1.0, random_state=0)
        pred[te] = make_pipeline(design(emb), est).fit(d[~te], y[~te]).predict(d[te])
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

g1 = loyo(df, []); r_raw = loyo(df, EMB) - g1; r_cal = loyo(df, CAL) - g1
rng = np.random.RandomState(1); null = [loyo(block_perm(df, CAL, rng), CAL) - g1 for _ in range(a.perms)]
p95 = float(np.percentile(null, 95))
out["S3"] = {"G1": float(g1), "dR2_uncalibrated": float(r_raw), "dR2_calibrated": float(r_cal), "null_p95": p95,
             "calibrated_above_null": bool(r_cal > p95), "year_offset_norms": {str(y): float(np.linalg.norm(offset[y])) for y in YEARS}}
print("S3", json.dumps(out["S3"], indent=1)); print("mean cos(stable,field shift)", round(mean_cos, 3), "| mean magnitude ratio", round(mean_ratio, 3))

if mean_cos >= 0.7 and mean_ratio >= 0.5 and r_cal > p95 and r_cal >= r_raw + 0.03: v = "PRODUCT_OFFSET"
elif mean_ratio < 0.3 or mean_cos < 0.3: v = "LAND_SURFACE_REAL"
else: v = "PARTIAL"
out.update({"mean_cos": mean_cos, "mean_magnitude_ratio": mean_ratio, "verdict": v}); print("VERDICT:", v)
json.dump(out, open(a.out, "w"), indent=1)
