"""Locate AlphaEarth tiles (per year) intersecting the Kenya survey extent.
Uses one .vrt sidecar per tile group (tiles come in 2x2 groups sharing an origin), then derives all sub-tile extents."""
import re, json, sys, time, math, urllib.request, urllib.parse, concurrent.futures as cf
BASE="https://s3.us-west-2.amazonaws.com/us-west-2.opendata.source.coop"
def http(u,retries=6):
    for a in range(retries):
        try: return urllib.request.urlopen(u,timeout=60).read().decode()
        except Exception: time.sleep(1+2*a)
    raise RuntimeError(u)
def lst(prefix):
    out=[];tok=None
    while True:
        u=BASE+"?list-type=2&max-keys=1000&prefix="+urllib.parse.quote(prefix)+("&continuation-token="+urllib.parse.quote(tok) if tok else "")
        t=http(u); out+=re.findall(r'<Key>(.*?)</Key>',t); m=re.search(r'<NextContinuationToken>(.*?)</NextContinuationToken>',t)
        if not m: break
        tok=m.group(1)
    return out
def utm(lon,lat,zone,south):
    a=6378137.0;f=1/298.257223563;k0=0.9996;e2=f*(2-f);ep2=e2/(1-e2)
    lam0=math.radians((zone-1)*6-180+3);phi=math.radians(lat);lam=math.radians(lon)
    N=a/math.sqrt(1-e2*math.sin(phi)**2);T=math.tan(phi)**2;C=ep2*math.cos(phi)**2;A=math.cos(phi)*(lam-lam0)
    M=a*((1-e2/4-3*e2**2/64-5*e2**3/256)*phi-(3*e2/8+3*e2**2/32+45*e2**3/1024)*math.sin(2*phi)+(15*e2**2/256+45*e2**3/1024)*math.sin(4*phi)-(35*e2**3/3072)*math.sin(6*phi))
    x=k0*N*(A+(1-T+C)*A**3/6+(5-18*T+T**2+72*C-58*ep2)*A**5/120)+500000
    y=k0*(M+N*math.tan(phi)*(A**2/2+(5-T+9*C+4*C**2)*A**4/24+(61-58*T+T**2+600*C-330*ep2)*A**6/720))
    return x,(y+10000000 if south else y)
if __name__=="__main__":
    year=int(sys.argv[1])
    # extent of Kenya survey with margin, in each zone
    need={"36N":(611000,834000,0,136000),"37N":(165000,370000,0,136000),"36S":(611000,834000,9870000,10000000),"37S":(165000,370000,9870000,10000000)}
    out={}
    for z,bx in need.items():
        keys=[k for k in lst(f"tge-labs/aef/v1/annual/{year}/{z}/") if k.endswith('.vrt')]
        groups={}
        for k in keys:
            m=re.match(r'(.*/[^/]+)-(\d{10})-(\d{10})\.vrt$',k); groups.setdefault(m.group(1),[]).append((int(m.group(2)),int(m.group(3)),k))
        def get(item):
            pre,subs=item; dx,dy,k=min(subs)
            t=http(BASE+"/"+k)
            g=[float(v) for v in re.search(r'<GeoTransform>(.*?)</GeoTransform>',t).group(1).split(',')]
            return pre,subs,dx,dy,g[0],g[3]   # top-left (north-up) of THIS sub-tile
        hits=[]
        with cf.ThreadPoolExecutor(4) as ex:
            for pre,subs,dx,dy,xl,yt in ex.map(get,groups.items()):
                gx0=xl-dx*10; gyt=yt+dy*10   # group top-left
                for sx,sy,k in subs:
                    x0=gx0+sx*10; ytop=gyt-sy*10; x1=x0+81920; ysouth=ytop-81920
                    if x0<bx[1] and x1>bx[0] and ysouth<bx[3] and ytop>bx[2]:
                        hits.append({"key":k[:-4]+".tiff","x0":x0,"x1":x1,"y_south":ysouth,"y_north":ytop})
        out[z]=hits; print(year,z,"groups",len(groups),"tiles intersecting",len(hits),flush=True)
    json.dump(out,open(f"tiles_{year}.json","w"),indent=1)
