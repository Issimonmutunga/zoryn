"""Exact compressed bytes per COG overview level (header reads only, no pixel data)."""
import struct, sys
import urllib.request
BASE = "https://s3.us-west-2.amazonaws.com/us-west-2.opendata.source.coop/"
def _get(key, a, b):
    req = urllib.request.Request(BASE + key, headers={"Range": f"bytes={a}-{b}"})
    return urllib.request.urlopen(req, timeout=90).read()
key = sys.argv[1]
buf = _get(key, 0, 4194303)
off = struct.unpack("<Q", buf[8:16])[0]; lvl = 0
while off:
    n = struct.unpack("<Q", buf[off:off+8])[0]; tags = {}
    for i in range(n):
        e = buf[off+8+i*20: off+28+i*20]; tag, typ, cnt = struct.unpack("<HHQ", e[:12]); raw = e[12:20]
        size = {3:2,4:4,12:8,16:8}.get(typ,1)*cnt
        if size <= 8: data = raw[:size]
        else:
            o = struct.unpack("<Q", raw)[0]; data = buf[o:o+size] if o+size <= len(buf) else _get(key, o, o+size-1)
        tags[tag] = (typ, cnt, data)
    f = lambda t: struct.unpack("<"+{3:"H",4:"I",16:"Q"}[tags[t][0]]*tags[t][1], tags[t][2])
    w, h = f(256)[0], f(257)[0]; counts = f(325)
    print(f"level {lvl}: {w}x{h}  tiles={len(counts)}  compressed={sum(counts)/1e6:.1f} MB")
    off = struct.unpack("<Q", buf[off+8+n*20: off+16+n*20])[0]; lvl += 1
