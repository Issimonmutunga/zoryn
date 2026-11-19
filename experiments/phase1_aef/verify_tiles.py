"""Verify tiles_<year>.json extents against the real TIFF headers (level-0 IFD only, ~1 MB per tile).
usage: python verify_tiles.py 2018 [2019 ...]   -> exits non-zero on any mismatch"""
import json, struct, sys, concurrent.futures as cf
from aef_blocks import _get


def header_origin(key):
    buf = _get(key, 0, 1048575)
    off = struct.unpack("<Q", buf[8:16])[0]
    n = struct.unpack("<Q", buf[off:off + 8])[0]
    for i in range(n):
        e = buf[off + 8 + i * 20: off + 28 + i * 20]
        tag, typ, cnt = struct.unpack("<HHQ", e[:12])
        if tag == 34264:
            o = struct.unpack("<Q", e[12:20])[0]
            m = struct.unpack("<" + "d" * cnt, buf[o:o + 8 * cnt] if o + 8 * cnt <= len(buf) else _get(key, o, o + 8 * cnt - 1))
            return m[3], m[7]
    raise ValueError("no ModelTransformation in " + key)


bad = 0
for y in map(int, sys.argv[1:]):
    tiles = [t for v in json.load(open(f"tiles_{y}.json")).values() for t in v]
    with cf.ThreadPoolExecutor(6) as ex:
        for t, (x0, ys) in zip(tiles, ex.map(lambda t: header_origin(t["key"]), tiles)):
            if (x0, ys) != (t["x0"], t["y_south"]):
                bad += 1; print("MISMATCH", t["key"][-40:], "header", (x0, ys), "json", (t["x0"], t["y_south"]))
    print(y, len(tiles), "tiles checked")
print("mismatches:", bad); sys.exit(1 if bad else 0)
