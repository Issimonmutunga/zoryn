"""
Generate a precomputed GeoJSON containing
environmental discoveries.

This script performs the expensive spatial join
once during data preparation so the REST API
can serve the resulting GeoJSON directly.
"""

from __future__ import annotations

import json
from pathlib import Path

import polars as pl
from shapely import from_wkb
from shapely.geometry import mapping


def main() -> None:
    """
    Build the discovery GeoJSON.
    """

    root = Path(__file__).resolve().parents[2]

    h3_path = (
        root
        / "data"
        / "processed"
        / "h3"
        / "pilot_nairobi_h3_res10.parquet"
    )

    discoveries_path = (
        root
        / "data"
        / "processed"
        / "knowledge"
        / "discoveries"
    )

    output_path = (
        root
        / "data"
        / "processed"
        / "h3"
        / "pilot_nairobi_discoveries.geojson"
    )

    print("Loading H3 geometry...")

    h3 = pl.read_parquet(
        h3_path,
    )

    print("Loading discoveries...")

    discoveries = pl.concat(
        [
            pl.read_parquet(file)
            for file in sorted(
                discoveries_path.glob(
                    "*.parquet"
                )
            )
        ]
    )

    print("Joining...")

    joined = h3.join(
        discoveries,
        on="h3_id",
        how="inner",
    )

    print(
        f"Joined {len(joined):,} discoveries."
    )

    features: list[dict] = []

    for row in joined.iter_rows(
        named=True,
    ):

        properties = {
            key: value
            for key, value in row.items()
            if key != "geometry"
        }

        features.append(
            {
                "type": "Feature",
                "geometry": mapping(
                    from_wkb(
                        row["geometry"]
                    )
                ),
                "properties": properties,
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

    print(
        f"Saved {output_path}"
    )


if __name__ == "__main__":
    main()