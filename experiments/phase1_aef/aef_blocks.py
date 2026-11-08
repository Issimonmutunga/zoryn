"""
Minimal, dependency-light reader for the public AlphaEarth COG mirror.

Why custom: the tiles are band-separate (planar) ZSTD COGs, so one spatial 1024x1024
block is 64 independent compressed tiles. Reading them through GDAL /vsicurl issues
thousands of tiny requests; here each band-tile is fetched with ONE ranged request,
in parallel, then decoded with zstandard.
"""
from __future__ import annotations
import struct, time, urllib.request, concurrent.futures as cf
import numpy as np, zstandard

BASE = "https://s3.us-west-2.amazonaws.com/us-west-2.opendata.source.coop/"
BLOCK = 1024


def _get(key: str, a: int, b: int, retries: int = 6) -> bytes:
    last = None
    for att in range(retries):
        try:
            req = urllib.request.Request(BASE + key, headers={"Range": f"bytes={a}-{b}"})
            with urllib.request.urlopen(req, timeout=90) as r:
                data = r.read()
            if len(data) != b - a + 1:
                raise IOError(f"short read {len(data)} != {b-a+1}")
            return data
        except Exception as e:  # noqa
            last = e
            time.sleep(1 + 2 * att)
    raise RuntimeError(f"range request failed for {key} {a}-{b}: {last}")


class AefTile:
    """Header of one COG tile: size, per-band tile offsets/byte counts, geotransform."""

    def __init__(self, key: str):
        self.key = key
        buf = _get(key, 0, 1048575)
        assert buf[:2] == b"II" and struct.unpack("<H", buf[2:4])[0] == 43, "expected little-endian BigTIFF"
        first = struct.unpack("<Q", buf[8:16])[0]
        n = struct.unpack("<Q", buf[first:first + 8])[0]
        tags = {}
        for i in range(n):
            ent = buf[first + 8 + i * 20: first + 8 + (i + 1) * 20]
            tag, typ, cnt = struct.unpack("<HHQ", ent[:12])
            raw = ent[12:20]
            size = {3: 2, 4: 4, 12: 8, 16: 8}.get(typ, 1) * cnt
            if size <= 8:
                data = raw[:size]
            else:
                o = struct.unpack("<Q", raw)[0]
                data = buf[o:o + size]
                if len(data) < size:
                    data = _get(key, o, o + size - 1)
            tags[tag] = (typ, cnt, data)

        def ints(tag):
            typ, cnt, data = tags[tag]
            code = {3: "H", 4: "I", 16: "Q", 12: "d"}[typ]
            return struct.unpack("<" + code * cnt, data)

        self.width, self.height = ints(256)[0], ints(257)[0]
        self.tile = ints(322)[0]
        assert ints(259)[0] == 50000 and ints(284)[0] == 2 and ints(277)[0] == 64, "unexpected layout"
        assert self.tile == BLOCK and ints(317)[0] == 1
        self.offsets = ints(324)
        self.counts = ints(325)
        self.tiles_across = self.width // self.tile
        self.tiles_per_band = self.tiles_across * (self.height // self.tile)
        # georeferencing via ModelTransformation (34264): x = a*col + X ; y = d*row + Y
        # NOTE: these tiles are stored with +10 m row step (rows increase northward in the TIFF).
        m = ints(34264)
        assert m[1] == 0 and m[4] == 0, "rotated transform not supported"
        self.x0, self.sx, self.y0, self.sy = m[3], m[0], m[7], m[5]

    def colrow(self, easting: float, northing: float):
        """Fractional (col,row) in this tile's native pixel grid for a UTM coordinate."""
        return (easting - self.x0) / self.sx, (northing - self.y0) / self.sy

    def block_bytes(self, brow: int, bcol: int) -> int:
        s = brow * self.tiles_across + bcol
        return sum(self.counts[b * self.tiles_per_band + s] for b in range(64))

    def read_block(self, brow: int, bcol: int, workers: int = 8) -> np.ndarray:
        """Return int8 array (64, 1024, 1024) for one spatial block."""
        s = brow * self.tiles_across + bcol

        def one(b):
            i = b * self.tiles_per_band + s
            raw = _get(self.key, self.offsets[i], self.offsets[i] + self.counts[i] - 1)
            out = zstandard.ZstdDecompressor().decompress(raw, max_output_size=BLOCK * BLOCK)
            if len(out) != BLOCK * BLOCK:
                raise ValueError("bad decoded size")
            return np.frombuffer(out, dtype=np.int8).reshape(BLOCK, BLOCK)

        with cf.ThreadPoolExecutor(workers) as ex:
            return np.stack(list(ex.map(one, range(64))))


def dequantize(a: np.ndarray) -> np.ndarray:
    """Official formula: ((x/127.5)^2) * sign(x); nodata (-128) -> NaN. Input (64, ...)."""
    x = a.astype(np.float32)
    v = np.sign(x) * (np.abs(x) / 127.5) ** 2
    v[a == -128] = np.nan
    return v
