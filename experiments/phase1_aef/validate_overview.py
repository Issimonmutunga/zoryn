"""Check the overview reader: (1) geotransform vs GDAL, (2) overview vs full-resolution block mean.
Costs one full-resolution 1024 block (~37 MB) plus one level-4 tile (~11 MB)."""
import sys, numpy as np, rasterio
from rasterio.windows import Window
from aef_blocks import AefTile, dequantize, BASE
from aef_overview import AefOverview, parse_ifds

key = "tge-labs/aef/v1/annual/2019/36N/xidmo41kj3moq79jg-0000000000-0000000000.tiff"
LEVEL = int(sys.argv[1]) if len(sys.argv) > 1 else 4
ifds = parse_ifds(key)
ov = AefOverview(key, LEVEL, ifds)
print(f"level {LEVEL}: {ov.w}x{ov.h} tile={ov.tile} pixel={ov.sx}/{ov.sy} m  {ov.nbytes/1e6:.1f} MB")
arr = ov.load()
print("loaded", arr.shape, "nodata frac %.3f" % float((arr == -128).mean()))

# (1) GDAL overview read at a pixel inside the tile
with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR", CPL_VSIL_CURL_ALLOWED_EXTENSIONS=".tiff"):
    with rasterio.open(BASE + key, OVERVIEW_LEVEL=LEVEL - 1) as ds:
        print("GDAL overview shape", ds.shape, "transform", ds.transform.to_gdal())
        g = ds.read(window=Window(100, 200, 8, 8))
print("overview identical to GDAL window:", bool(np.array_equal(g, arr[:, 200:208, 100:108])))

# (2) overview pixel vs mean of the full-resolution pixels it covers (block 7,2 at level 0)
f = 2 ** LEVEL
t = AefTile(key)
blk = t.read_block(7, 2)                        # level-0 rows 7168-8191, cols 2048-3071
oc0, or0 = 2048 // f, 7168 // f
cos, err = [], []
for dr in range(0, 1024 // f - 1, 3):
    for dc in range(0, 1024 // f - 1, 3):
        o = dequantize(arr[:, or0 + dr, oc0 + dc])
        full = dequantize(blk[:, dr * f:(dr + 1) * f, dc * f:(dc + 1) * f]).reshape(64, -1)
        if np.isnan(o).any() or np.isnan(full).all():
            continue
        m = np.nanmean(full, axis=1)
        cos.append(float(o @ m / (np.linalg.norm(o) * np.linalg.norm(m)))); err.append(float(np.abs(o - m).mean()))
print(f"vs level-0 box mean: n={len(cos)} cosine mean={np.mean(cos):.4f} min={np.min(cos):.4f}; mean abs diff={np.mean(err):.4f}")
# Also compare against nearest-neighbour subsample (to tell averaging from decimation)
nn = []
for dr in range(0, 1024 // f - 1, 3):
    for dc in range(0, 1024 // f - 1, 3):
        o = dequantize(arr[:, or0 + dr, oc0 + dc]); s = dequantize(blk[:, dr * f + f // 2, dc * f + f // 2])
        if not (np.isnan(o).any() or np.isnan(s).any()):
            nn.append(float(np.abs(o - s).mean()))
print(f"mean abs diff vs centre-pixel subsample: {np.mean(nn):.4f}  (smaller than box-mean diff => decimation)")
