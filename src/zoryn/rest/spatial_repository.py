"""
Spatial repository.

Provides spatial access to persisted H3 geometries and joins them with
environmental discoveries for map visualisation.
"""

from __future__ import annotations

from pathlib import Path

import polars as pl
from shapely import from_wkb
from shapely.geometry import mapping


class SpatialRepository:
    """
    Read persisted spatial data.
    """

    def __init__(
        self,
        discoveries: pl.DataFrame,
        h3_path: Path,
    ) -> None:

        self._discoveries = discoveries

        self._h3 = pl.read_parquet(
            h3_path
        )

    def map_discoveries(
        self,
    ) -> dict:

        joined = self._h3.join(
            self._discoveries,
            on="h3_id",
            how="inner",
        )

        features = []

        for row in joined.iter_rows(
            named=True,
        ):

            geometry = mapping(
                from_wkb(
                    row["geometry"]
                )
            )

            properties = {
                key: value
                for key, value in row.items()
                if key != "geometry"
            }

            features.append(
                {
                    "type": "Feature",
                    "geometry": geometry,
                    "properties": properties,
                }
            )

        return {
            "type": "FeatureCollection",
            "features": features,
        }