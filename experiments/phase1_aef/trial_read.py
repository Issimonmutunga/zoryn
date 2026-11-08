import time, numpy as np, rasterio
from rasterio.windows import Window
URL="https://s3.us-west-2.amazonaws.com/us-west-2.opendata.source.coop/tge-labs/aef/v1/annual/2019/36N/xidmo41kj3moq79jg-0000000000-0000000000.tiff"
env=dict(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR",CPL_VSIL_CURL_ALLOWED_EXTENSIONS=".tiff",GDAL_CACHEMAX=1024,GDAL_HTTP_MULTIPLEX="YES",GDAL_HTTP_VERSION="2",VSI_CACHE="FALSE")
with rasterio.Env(**env):
    t=time.time()
    with rasterio.open(URL) as ds:
        print("open %.1fs"%(time.time()-t), ds.count, ds.dtypes[0], ds.crs, ds.transform.to_gdal(), ds.block_shapes[0], ds.nodata)
        # centre of one 1024 block, 11x11 window
        w=Window(2*1024+500,7*1024+500,11,11)
        t=time.time(); a=ds.read(window=w); dt=time.time()-t
        print("read 11x11x64 in %.1fs"%dt, a.shape, a.dtype, "nodata frac", float((a==-128).mean()))
        # second window in same block should be cached
        t=time.time(); b=ds.read(window=Window(2*1024+600,7*1024+300,11,11)); print("second window same block %.2fs"%(time.time()-t))
x=a.astype(np.float32)
v=np.sign(x)*(np.abs(x)/127.5)**2
v[a==-128]=np.nan
cen=v[:,5,5]; print("norm of centre pixel", float(np.linalg.norm(cen)))
norms=np.linalg.norm(v.reshape(64,-1),axis=0); print("pixel norms min/mean/max", np.nanmin(norms), np.nanmean(norms), np.nanmax(norms))
c=v.reshape(64,-1); cs=(c.T@cen)/(np.linalg.norm(c,axis=0)*np.linalg.norm(cen)); print("cos(neighbour, centre) min/mean", float(np.nanmin(cs)), float(np.nanmean(cs)))
print("raw int range", int(a.min()), int(a.max()))
