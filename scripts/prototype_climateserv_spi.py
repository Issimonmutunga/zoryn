"""
Prototype: source CHIRPS from the ClimateSERV API instead of the
Earth Engine export notebooks, and compare the resulting SPI with
Zoryn's existing outputs for Nairobi County.

Series compared (monthly, county level):

    A  ClimateSERV CHIRPS county mean  -> Zoryn compute_spi
    B  Existing GEE observations, mean over H3 cells -> Zoryn compute_spi
    C  Existing per-cell SPI parquet, mean over H3 cells

A vs B isolates the data source (API vs notebook pipeline).
B vs C isolates aggregation (SPI of the mean vs mean of the SPI).

Usage:
    python scripts/prototype_climateserv_spi.py [--refresh]

Daily responses are cached under data/raw/climateserv/.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from pathlib import Path

import numpy as np
import polars as pl
import requests
import shapely

ROOT = Path(__file__).resolve().parents[1]

sys.path.insert(0, str(ROOT / "src"))

from zoryn.indices.spi import compute_spi  # noqa: E402

BASE_URL = "https://climateserv.servirglobal.net/api/"
CHIRPS_DATATYPE = 0
AVERAGE_OPERATION = 5

START_YEAR = 2002
COMMON_END = "2024-12"
SCALES = (3, 6, 12)
DROUGHT_THRESHOLD = -1.0  # WMO: moderately dry or worse

ADMIN_FILE = ROOT / "data/raw/admin/nairobi_county.geoparquet"
OBSERVATIONS_FILE = ROOT / "data/processed/observations/observations_chirps_monthly.parquet"
SPI_DIR = ROOT / "data/processed/spi"
CACHE_DIR = ROOT / "data/raw/climateserv"


# --------------------------------------------------------------------- fetch


def nairobi_geometry() -> str:
    """County polygon as the compact GeoJSON string ClimateSERV expects."""

    admin = pl.read_parquet(ADMIN_FILE)
    geometry = shapely.from_wkb(admin["geometry"][0])

    # ~200 m tolerance keeps the URL short; CHIRPS pixels are ~5.5 km.
    polygon = max(getattr(geometry, "geoms", [geometry]), key=lambda g: g.area)
    polygon = polygon.simplify(0.002)

    coordinates = [[round(x, 5), round(y, 5)] for x, y in polygon.exterior.coords]

    return json.dumps(
        {"type": "Polygon", "coordinates": [coordinates], "properties": {}},
        separators=(",", ":"),
    )


def fetch_range(geometry: str, start: date, end: date) -> list[dict]:
    """Submit a ClimateSERV job, wait for it, and return its daily rows."""

    response = requests.post(
        BASE_URL + "submitDataRequest/",
        params={
            "datatype": CHIRPS_DATATYPE,
            "begintime": start.strftime("%m/%d/%Y"),
            "endtime": end.strftime("%m/%d/%Y"),
            "intervaltype": 0,
            "operationtype": AVERAGE_OPERATION,
            "dateType_Category": "default",
            "isZip_CurrentDataType": False,
            "geometry": geometry,
        },
        timeout=120,
    )
    response.raise_for_status()
    job_id = response.json()[0]

    deadline = time.monotonic() + 600

    while True:
        progress = requests.get(
            BASE_URL + "getDataRequestProgress/",
            params={"id": job_id},
            timeout=60,
        ).json()[0]

        if progress == 100:
            break
        if progress == -1:
            raise RuntimeError(f"ClimateSERV job {job_id} failed.")
        if time.monotonic() > deadline:
            raise TimeoutError(f"ClimateSERV job {job_id} timed out.")

        time.sleep(3)

    data = requests.get(
        BASE_URL + "getDataFromRequest/",
        params={"id": job_id},
        timeout=120,
    ).json()

    return [
        {
            "date": date(row["year"], row["month"], row["day"]),
            "precipitation_mm": float(row["raw_value"]),
        }
        for row in data["data"]
        # ClimateSERV marks missing days with a large negative fill value.
        if row["raw_value"] is not None and row["raw_value"] > -9000
    ]


def fetch_year(geometry: str, year: int, refresh: bool) -> pl.DataFrame:
    cache = CACHE_DIR / f"chirps_nairobi_{year}.parquet"
    current_year = date.today().year

    # Past years never change; always refetch the current one.
    if cache.exists() and not refresh and year < current_year:
        return pl.read_parquet(cache)

    end = min(date(year, 12, 31), date.today())
    frame = pl.DataFrame(
        fetch_range(geometry, date(year, 1, 1), end),
        schema={"date": pl.Date, "precipitation_mm": pl.Float64},
    )

    frame.write_parquet(cache)

    return frame


def fetch_daily(refresh: bool) -> pl.DataFrame:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    geometry = nairobi_geometry()
    years = range(START_YEAR, date.today().year + 1)

    with ThreadPoolExecutor(max_workers=4) as pool:
        frames = list(pool.map(lambda y: fetch_year(geometry, y, refresh), years))

    return pl.concat(frames).sort("date")


# ----------------------------------------------------------------- series


def climateserv_monthly(daily: pl.DataFrame) -> pl.DataFrame:
    """Monthly totals, dropping a trailing month that isn't complete yet."""

    monthly = (
        daily.with_columns(month=pl.col("date").dt.strftime("%Y-%m"))
        .group_by("month")
        .agg(
            rainfall=pl.col("precipitation_mm").sum(),
            days=pl.len(),
            last=pl.col("date").max(),
        )
        .sort("month")
    )

    last = monthly.row(-1, named=True)
    if last["last"] != (pl.Series([last["last"]]).dt.month_end()[0]):
        monthly = monthly.head(-1)

    return monthly.select("month", "rainfall", "days")


def existing_monthly() -> pl.DataFrame:
    return (
        pl.scan_parquet(OBSERVATIONS_FILE)
        .filter(pl.col("variable") == "precipitation_amount")
        .group_by(pl.col("timestamp").alias("month"))
        .agg(
            # A few edge cells fall outside the exported raster and are NaN.
            rainfall=pl.col("value").cast(pl.Float64).fill_nan(None).mean(),
            distinct_values=pl.col("value").n_unique(),
            cells=pl.col("h3_id").n_unique(),
            nan_cells=pl.col("value").is_nan().sum(),
        )
        .sort("month")
        .collect()
    )


def existing_spi_mean(scale: int) -> pl.DataFrame:
    column = f"spi{scale}"

    return (
        pl.scan_parquet(SPI_DIR / f"{column}.parquet")
        .group_by(pl.col("timestamp").alias("month"))
        .agg(pl.col(column).fill_nan(None).mean().alias("spi"))
        .sort("month")
        .collect()
    )


# ----------------------------------------------------------------- compare


def pair_stats(a: np.ndarray, b: np.ndarray) -> dict[str, float]:
    mask = np.isfinite(a) & np.isfinite(b)
    a, b = a[mask], b[mask]

    return {
        "n": int(mask.sum()),
        "r": float(np.corrcoef(a, b)[0, 1]),
        "mae": float(np.mean(np.abs(a - b))),
        "bias": float(np.mean(a - b)),
    }


def drought_agreement(a: np.ndarray, b: np.ndarray) -> dict[str, int]:
    mask = np.isfinite(a) & np.isfinite(b)
    da = a[mask] <= DROUGHT_THRESHOLD
    db = b[mask] <= DROUGHT_THRESHOLD

    return {
        "both": int(np.sum(da & db)),
        "only_first": int(np.sum(da & ~db)),
        "only_second": int(np.sum(~da & db)),
        "neither": int(np.sum(~da & ~db)),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    parser.add_argument("--refresh", action="store_true", help="Ignore cached years.")
    args = parser.parse_args()

    started = time.monotonic()
    daily = fetch_daily(args.refresh)
    fetch_seconds = time.monotonic() - started

    api = climateserv_monthly(daily)
    old = existing_monthly()

    print("=" * 72)
    print("CLIMATESERV PROTOTYPE - NAIROBI COUNTY")
    print("=" * 72)
    print(f"ClimateSERV daily rows   : {daily.height:,} ({daily['date'].min()} .. {daily['date'].max()})")
    print(f"ClimateSERV fetch time   : {fetch_seconds:,.1f} s (cached years are instant)")
    print(f"ClimateSERV months       : {api['month'][0]} .. {api['month'][-1]} ({api.height})")
    print(f"Existing pipeline months : {old['month'][0]} .. {old['month'][-1]} ({old.height})")
    print(f"Existing H3 cells        : {old['cells'].max():,} "
          f"({old['nan_cells'].max()} NaN every month, excluded)")
    print(f"Distinct rainfall values per month across cells: "
          f"median {old['distinct_values'].median():.0f}, max {old['distinct_values'].max()}")

    common = (
        api.filter(pl.col("month") <= COMMON_END)
        .join(old, on="month", how="inner", suffix="_existing")
        .sort("month")
    )

    if common["month"][0] != f"{START_YEAR}-01":
        raise SystemExit("Common window must start in January for compute_spi.")

    a_rain = common["rainfall"].to_numpy()
    b_rain = common["rainfall_existing"].to_numpy()

    print("\nMonthly rainfall, A (ClimateSERV) vs B (existing), "
          f"{common['month'][0]}..{common['month'][-1]}")
    stats = pair_stats(a_rain, b_rain)
    print(f"  n={stats['n']}  r={stats['r']:.4f}  MAE={stats['mae']:.2f} mm  "
          f"bias={stats['bias']:+.2f} mm  (mean {b_rain.mean():.1f} mm/month)")

    rows = []

    for scale in SCALES:
        spi_a = compute_spi(a_rain, scale)
        spi_b = compute_spi(b_rain, scale)
        spi_c = (
            common.select("month")
            .join(existing_spi_mean(scale), on="month", how="left")["spi"]
            .to_numpy()
            .astype(float)
        )

        print(f"\nSPI-{scale}")
        for label, x, y in (("A vs B (source)     ", spi_a, spi_b),
                            ("B vs C (aggregation)", spi_b, spi_c),
                            ("A vs C (end to end) ", spi_a, spi_c)):
            s = pair_stats(x, y)
            d = drought_agreement(x, y)
            print(f"  {label} r={s['r']:.4f}  MAE={s['mae']:.3f}  "
                  f"drought months (SPI<=-1): both={d['both']} "
                  f"first-only={d['only_first']} second-only={d['only_second']}")

        rows.append(
            pl.DataFrame({
                "month": common["month"],
                "scale": scale,
                "spi_climateserv": spi_a,
                "spi_existing_rainfall": spi_b,
                "spi_existing_cell_mean": spi_c,
            })
        )

    # What the live API adds beyond the existing export.
    extension = api.filter(pl.col("month") > COMMON_END)
    if extension.height:
        full = api["rainfall"].to_numpy()
        spi3 = compute_spi(full, 3)
        tail = extension.with_columns(spi3=pl.Series(spi3[-extension.height:]))
        print(f"\nMonths available from the API beyond {COMMON_END}: {extension.height}")
        print("  latest SPI-3 (fit on full ClimateSERV record):")
        for row in tail.tail(6).iter_rows(named=True):
            print(f"    {row['month']}  rainfall={row['rainfall']:7.1f} mm  SPI-3={row['spi3']:+.2f}")

    output = CACHE_DIR / "spi_comparison.csv"
    pl.concat(rows).write_csv(output)
    common.select("month", "rainfall", "rainfall_existing").write_csv(
        CACHE_DIR / "rainfall_comparison.csv"
    )
    print(f"\nWrote {output.relative_to(ROOT)} and rainfall_comparison.csv")


if __name__ == "__main__":
    main()
