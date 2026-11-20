"""
Overview-level reader for the public AlphaEarth COGs (low data movement).

Full-resolution tiles cost ~2.4 GB each (64 planar bands). Their COG overviews are
~11 MB per tile at 160 m (level 4) and ~2.8 MB at 320 m (level 5). Research-phase
analysis uses 1-5 km neighbourhood means, so an overview is sufficient.

Everything is plain HTTP range requests (streamed, nothing written to disk).
"""
from __future__ import annotations
import struct, concurrent.futures as cf
import numpy as np, zstandard
from aef_blocks import _get, dequantize

_CODE = {3: "H", 4: "I", 12: "d", 16: "Q"}


def parse_ifds(key: str, head_bytes: int = 4 * 1024 * 1024) -> list[dict]:
    """Parse the BigTIFF IFD chain: one dict per level (0 = full resolution)."""
    buf = _get(key, 0, head_bytes - 1)
    assert buf[:2] == b"II" and struct.unpack("<H", buf[2:4])[0] == 43, "expected little-endian BigTIFF"
    off = struct.unpack("<Q", buf[8:16])[0]
    levels = []
    while off:
        n = struct.unpack("<Q", buf[off:off + 8])[0]
        tags = {}
        for i in range(n):
            e = buf[off + 8 + i * 20: off + 28 + i * 20]
            tag, typ, cnt = struct.unpack("<HHQ", e[:12])
            size = {3: 2, 4: 4, 12: 8, 16: 8}.get(typ, 1) * cnt
            if size <= 8:
                data = e[12:12 + size]
            else:
                o = struct.unpack("<Q", e[12:20])[0]
                data = buf[o:o + size] if o + size <= len(buf) else _get(key, o, o + size - 1)
            tags[tag] = (typ, cnt, data)

        def ints(t):
            typ, cnt, data = tags[t]
            return struct.unpack("<" + _CODE[typ] * cnt, data)

        lv = dict(width=ints(256)[0], height=ints(257)[0], tile=ints(322)[0],
                  offsets=ints(324), counts=ints(325))
        if 34264 in tags:
            lv["model"] = ints(34264)
        assert ints(259)[0] == 50000 and ints(284)[0] == 2 and ints(277)[0] == 64, "unexpected layout"
        levels.append(lv)
        off = struct.unpack("<Q", buf[off + 8 + n * 20: off + 16 + n * 20])[0]
    return levels


class AefOverview:
    """One tile at one overview level, fully loaded as dequantisable int8 (64, h, w)."""

    def __init__(self, key: str, level: int, ifds: list[dict] | None = None):
        self.key, self.level = key, level
        ifds = ifds or parse_ifds(key)
        l0, lv = ifds[0], ifds[level]
        m = l0["model"]
        assert m[1] == 0 and m[4] == 0, "rotated transform not supported"
        # Overview origin = level-0 origin; pixel size scales by width ratio.
        self.sx = m[0] * l0["width"] / lv["width"]
        self.sy = m[5] * l0["height"] / lv["height"]
        self.x0, self.y0 = m[3], m[7]
        self.w, self.h, self.tile = lv["width"], lv["height"], lv["tile"]
        self.lv = lv

    @property
    def nbytes(self) -> int:
        return sum(self.lv["counts"])

    def load(self, workers: int = 16) -> np.ndarray:
        lv, T = self.lv, self.lv["tile"]
        across, down = -(-self.w // T), -(-self.h // T)
        tpb = across * down

        def band(b):
            plane = np.zeros((down * T, across * T), dtype=np.int8)
            for s in range(tpb):
                i = b * tpb + s
                raw = _get(self.key, lv["offsets"][i], lv["offsets"][i] + lv["counts"][i] - 1)
                px = np.frombuffer(zstandard.ZstdDecompressor().decompress(raw, max_output_size=T * T),
                                   dtype=np.int8).reshape(T, T)
                r, c = divmod(s, across)
                plane[r * T:(r + 1) * T, c * T:(c + 1) * T] = px
            return plane[:self.h, :self.w]

        with cf.ThreadPoolExecutor(workers) as ex:
            return np.stack(list(ex.map(band, range(64))))

    def colrow(self, easting: float, northing: float):
        return (easting - self.x0) / self.sx, (northing - self.y0) / self.sy


def neighbourhood_mean(arr: np.ndarray, col: float, row: float, radius_px: int):
    """Mean of dequantised embeddings in a square window. Returns (vector64, valid_fraction)."""
    c, r = int(np.floor(col)), int(np.floor(row))
    r0, r1 = max(r - radius_px, 0), min(r + radius_px + 1, arr.shape[1])
    c0, c1 = max(c - radius_px, 0), min(c + radius_px + 1, arr.shape[2])
    if r0 >= r1 or c0 >= c1:
        return None, 0.0
    win = arr[:, r0:r1, c0:c1]
    v = dequantize(win)
    valid = ~np.isnan(v[0])
    if not valid.any():
        return None, 0.0
    return np.nanmean(v.reshape(64, -1), axis=1), float(valid.mean())
