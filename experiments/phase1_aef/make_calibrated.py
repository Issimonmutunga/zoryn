"""Write out/field_embeddings_cal.parquet: survey-year embeddings minus a per-year offset estimated from stable-land sites only
(reference year 2019; same offset as stable_calibration.py S3)."""
import numpy as np, pandas as pd
EMB = [f"A{k:02d}" for k in range(64)]; YEARS = (2018, 2019, 2020)
sites = pd.read_csv("out/stable_sites.csv"); sites["field_id"] = sites.index
S = {y: sites[["field_id", "cls"]].merge(pd.read_parquet(f"out/stable_ey{y}.parquet")[["field_id"] + EMB], on="field_id") for y in YEARS}
ok = set.intersection(*[set(S[y].dropna(subset=EMB).field_id) for y in YEARS])
for y in YEARS: S[y] = S[y][S[y].field_id.isin(ok)].sort_values("field_id").reset_index(drop=True)
cls = S[2019].cls.values
cm = lambda y: np.mean([S[y][EMB].values[cls == c].mean(0) for c in ("tree", "water", "built") if (cls == c).sum() >= 5], axis=0)
ref = cm(2019); off = {y: cm(y) - ref for y in YEARS}
own = pd.read_parquet("out/field_embeddings.parquet")
for y in YEARS:
    m = own.year == y; own.loc[m, EMB] = own.loc[m, EMB].values - off[y]
own.to_parquet("out/field_embeddings_cal.parquet", index=False); print(len(own))
