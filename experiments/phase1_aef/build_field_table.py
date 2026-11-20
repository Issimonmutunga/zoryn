"""
Per-field AlphaEarth neighbourhood-mean table from COG overviews (streamed; nothing cached to disk).

usage: python build_field_table.py SURVEY_CSV [--level 4] [--radius-px 3] [--years 2018 2019 2020] [--out out/field_embeddings.parquet]

Level 4 = 160 m pixels (~11 MB per tile); radius 3 px => 7x7 window ~ 1.1 km square.
Uses tiles_<year>.json from discover_tiles.py. Fields with no covering tile are reported, not dropped silently.
"""
import argparse, json, os, sys, time, concurrent.futures as cf
import numpy as np, pandas as pd
from discover_tiles import utm
from aef_overview import AefOverview, parse_ifds, neighbourhood_mean

ap = argparse.ArgumentParser()
ap.add_argument("csv"); ap.add_argument("--level", type=int, default=4); ap.add_argument("--radius-px", type=int, default=3)
ap.add_argument("--years", type=int, nargs="+", default=[2018, 2019, 2020])
ap.add_argument("--embed-year", type=int, default=None,
                help="sample EVERY field from this year's embeddings instead of its own survey year (drift tests)")
ap.add_argument("--out", default="out/field_embeddings.parquet"); ap.add_argument("--tile-workers", type=int, default=3)
a = ap.parse_args()

df = pd.read_csv(a.csv, usecols=["year", "country", "lon", "lat", "strat", "yield_kg_ha", "soil_clay"])
df = df[(df.country == "kenya") & df.year.isin(a.years)].copy()
df["field_id"] = df.index
print("Kenya fields in years", a.years, ":", len(df))

# assign each field to a tile (per year)
assign, unlocated = {}, []
# only the imagery years actually sampled (with --embed-year the survey years need no tile list, e.g. 2016 has no imagery)
tiles_by_year = {y: json.load(open(f"tiles_{y}.json")) for y in ({a.embed_year} if a.embed_year else set(a.years))}
for r in df.itertuples():
    zone = int((r.lon + 180) // 6) + 1
    south = r.lat < 0
    x, y = utm(r.lon, r.lat, zone, south)
    zk = f"{zone}{'S' if south else 'N'}"
    ey = a.embed_year or r.year
    hit = next((t for t in tiles_by_year[ey].get(zk, [])
                if t["x0"] <= x < t["x1"] and t["y_south"] <= y < t["y_north"]), None)
    if hit is None:
        unlocated.append(r.field_id); continue
    assign.setdefault((ey, hit["key"]), []).append((r.field_id, x, y))
print("unlocated (no covering tile):", len(unlocated), "| distinct (year,tile):", len(assign))

def work(item):
    (year, key), pts = item
    ov = AefOverview(key, a.level, parse_ifds(key))
    arr = ov.load()
    rows = []
    for fid, x, y in pts:
        col, row = ov.colrow(x, y)
        vec, vf = neighbourhood_mean(arr, col, row, a.radius_px)
        rows.append((fid, key, vf, vec))
    return ov.nbytes, rows

t0, total, out_rows = time.time(), 0, []
with cf.ThreadPoolExecutor(a.tile_workers) as ex:
    for i, (nb, rows) in enumerate(ex.map(work, assign.items()), 1):
        total += nb; out_rows += rows
        print(f"[{i}/{len(assign)}] {total/1e6:.0f} MB streamed, {time.time()-t0:.0f}s", flush=True)

emb = np.full((len(out_rows), 64), np.nan, dtype=np.float32)
for i, (_, _, _, v) in enumerate(out_rows):
    if v is not None: emb[i] = v
res = pd.DataFrame({"field_id": [r[0] for r in out_rows], "tile": [r[1] for r in out_rows],
                    "valid_frac": [r[2] for r in out_rows]})
for k in range(64): res[f"A{k:02d}"] = emb[:, k]
res = df.drop(columns=["country"]).merge(res, on="field_id", how="inner")
res.attrs = {}
os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
res.to_parquet(a.out, index=False)
print(f"wrote {a.out}: {len(res)} fields, {int(res['A00'].isna().sum())} without valid embedding, "
      f"{total/1e9:.2f} GB streamed (vs ~33 GB full-resolution)")
json.dump({"level": a.level, "radius_px": a.radius_px, "years": a.years, "kenya_fields": int(len(df)),
           "unlocated_field_ids": unlocated, "bytes_streamed": total}, open(a.out + ".meta.json", "w"))
