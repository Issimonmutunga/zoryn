"""
Pick spatially homogeneous 'stable land' patches (tree cover, permanent water, built-up) in the Kenya survey extent
from ESA WorldCover v200 (2021), streamed by range requests (a coarse overview to find candidates, then a full-resolution
window to verify). Output: out/stable_sites.csv, shaped like the survey CSV so build_field_table.py can sample AlphaEarth at it.

Assumption (stated, not tested): forest / open water / built-up in 2021 were the same class in 2018-2020.
Patch = 1.12 km square (the same 7x7 level-4 window used for fields); accept if >= 95% of 10 m pixels share the class
(80% for built-up, which is rarely pure).
usage: python select_stable_sites.py [--per-class 40]
"""
import argparse, json, numpy as np, pandas as pd, rasterio
from rasterio.windows import Window
from discover_tiles import utm

ap = argparse.ArgumentParser(); ap.add_argument("--per-class", type=int, default=40); a = ap.parse_args()
CLASSES = {10: ("tree", 0.95), 80: ("water", 0.95), 50: ("built", 0.80)}
TILES = ["N00E033", "S03E033", "N00E036", "S03E036"]
tiles19 = json.load(open("tiles_2019.json"))
rng = np.random.RandomState(0)


def covered(lon, lat):
    zone = int((lon + 180) // 6) + 1; south = lat < 0; x, y = utm(lon, lat, zone, south)
    # patch must sit well inside one AEF tile (1.5 km margin)
    return any(t["x0"] + 1500 <= x < t["x1"] - 1500 and t["y_south"] + 1500 <= y < t["y_north"] - 1500
               for t in tiles19.get(f"{zone}{'S' if south else 'N'}", []))


found = {c: [] for c in CLASSES}
env = dict(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR", CPL_VSIL_CURL_ALLOWED_EXTENSIONS=".tif")
with rasterio.Env(**env):
    for t in TILES:
        u = f"https://esa-worldcover.s3.eu-central-1.amazonaws.com/v200/2021/map/ESA_WorldCover_10m_2021_v200_{t}_Map.tif"
        with rasterio.open(u) as ds:
            coarse = ds.read(1, out_shape=(2250, 2250))               # 1/16 overview, 160 m pixels
            tr = ds.transform
            for c, (name, thr) in CLASSES.items():
                # coarse pixels whose 5x5 neighbourhood is all class c
                m = (coarse == c).astype(np.uint8)
                k = np.zeros_like(m, dtype=np.int32)
                for dr in range(-2, 3):
                    for dc in range(-2, 3):
                        k += np.roll(np.roll(m, dr, 0), dc, 1)
                rows, cols = np.where(k == 25)
                order = rng.permutation(len(rows))
                for i in order[:4000]:
                    r, cc = rows[i], cols[i]
                    lon, lat = tr * (cc * 16 + 8, r * 16 + 8)
                    if not covered(lon, lat): continue
                    if any(abs(lon - s["lon"]) < 0.08 and abs(lat - s["lat"]) < 0.08 for s in found[c]): continue
                    px = ds.index(lon, lat)
                    w = ds.read(1, window=Window(px[1] - 56, px[0] - 56, 112, 112))
                    if w.shape != (112, 112) or (w == c).mean() < thr: continue
                    found[c].append({"lon": float(lon), "lat": float(lat), "cls": name, "purity": float((w == c).mean())})
                    if len(found[c]) >= a.per_class: break
        print(t, {CLASSES[c][0]: len(v) for c, v in found.items()}, flush=True)

rows = [s for v in found.values() for s in v]
df = pd.DataFrame(rows)
out = pd.DataFrame({"year": 2019, "country": "kenya", "lon": df.lon, "lat": df.lat, "strat": df.cls,
                    "yield_kg_ha": 0.0, "soil_clay": np.nan, "cls": df.cls, "purity": df.purity})
out.to_csv("out/stable_sites.csv", index=False)
print(out.groupby("cls").agg(n=("lon", "size"), purity=("purity", "mean"), lon_min=("lon", "min"), lon_max=("lon", "max")))
