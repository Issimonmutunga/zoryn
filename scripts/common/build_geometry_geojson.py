"""
Generate a precomputed GeoJSON representation of the
pilot H3 grid.

This script converts the persisted H3 geometry parquet
into a GeoJSON FeatureCollection so the REST API can
serve geometry without constructing it at runtime.
"""

from __future__ import annotations

import json
from pathlib import Path

import polars as pl
from shapely import from_wkb
from shapely.geometry import mapping


def main() -> None:
    """
    Build the H3 GeoJSON file.
    """

    root = Path(__file__).resolve().parents[2]

    input_path = (
        root
        / "data"
        / "processed"
        / "h3"
        / "pilot_nairobi_h3_res10.parquet"
    )

    output_path = (
        root
        / "data"
        / "processed"
        / "h3"
        / "pilot_nairobi_h3_res10.geojson"
    )

    print(f"Loading {input_path}...")

    h3 = pl.read_parquet(input_path)

    print(f"Loaded {len(h3):,} H3 cells.")

    features: list[dict] = []

    for row in h3.iter_rows(named=True):

        features.append(
            {
                "type": "Feature",
                "geometry": mapping(
                    from_wkb(
                        row["geometry"]
                    )
                ),
                "properties": {
                    "h3_id": row["h3_id"],
                    "latitude": row["latitude"],
                    "longitude": row["longitude"],
                },
            }
        )

    geojson = {
        "type": "FeatureCollection",
        "features": features,
    }

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with output_path.open(
        "w",
        encoding="utf-8",
    ) as handle:

        json.dump(
            geojson,
            handle,
            separators=(",", ":"),
        )

    print("Generated FeatureCollection.")
    print(f"Saved: {output_path}")


if __name__ == "__main__":
    main()