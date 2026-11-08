import time, numpy as np, rasterio
from rasterio.windows import Window
from aef_blocks import AefTile, dequantize
key="tge-labs/aef/v1/annual/2019/36N/xidmo41kj3moq79jg-0000000000-0000000000.tiff"
t=AefTile(key); print("header ok", t.width,t.height,"origin",t.x0,t.y0,"scale",t.sx,t.sy,"block MB %.1f"%(t.block_bytes(7,2)/1e6))
for w in (4,8,16):
    t0=time.time(); blk=t.read_block(7,2,workers=w); dt=time.time()-t0
    print(f"workers={w}: {dt:.1f}s  {t.block_bytes(7,2)/1e6/dt:.1f} MB/s", blk.shape)
# validate against GDAL on an 11x11 window
URL="https://s3.us-west-2.amazonaws.com/us-west-2.opendata.source.coop/"+key
with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR",CPL_VSIL_CURL_ALLOWED_EXTENSIONS=".tiff",CPL_VSIL_CURL_CHUNK_SIZE=4194304):
    with rasterio.open(URL) as ds:
        print("GDAL transform", ds.transform.to_gdal())
        r0,c0=7*1024+300,2*1024+400
        g=ds.read(window=Window(c0,r0,11,11))
mine=blk[:,300:311,400:411]
print("identical to GDAL window:", bool(np.array_equal(g,mine)))
v=dequantize(mine); n=np.linalg.norm(v.reshape(64,-1),axis=0); print("norm min/mean/max",n.min(),n.mean(),n.max())
