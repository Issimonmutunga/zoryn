"""
Spatial repository.

Provides spatial access to persisted H3 geometries
for map visualisation.
"""

from __future__ import annotations

from pathlib import Path

import polars as pl
from shapely import from_wkb
from shapely.geometry import mapping

from .repository import KnowledgeRepository


class SpatialRepository:
    """
    Build spatial representations of the
    knowledge repository.
    """

    #
    # Shared process-wide cache.
    #
    _h3: pl.DataFrame | None = None
    _geojson_cache: dict | None = None
    _geometry_cache: dict | None = None

    def __init__(
        self,
        repository: KnowledgeRepository,
    ) -> None:

        self._repository = repository

        if SpatialRepository._h3 is None:

            root = Path(__file__).resolve().parents[3]

            SpatialRepository._h3 = pl.read_parquet(
                root
                / "data"
                / "processed"
                / "h3"
                / "pilot_nairobi_h3_res10.parquet"
            )
    def geometry(
        self,
    ) -> dict:
        """
        Return static H3 geometry.

        Geometry never changes and is cached
        independently from SPI observations.
        """

        if (
            SpatialRepository._geometry_cache
            is not None
        ):
            return SpatialRepository._geometry_cache

        features = []

        for row in SpatialRepository._h3.iter_rows(
            named=True,
        ):

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

        SpatialRepository._geometry_cache = {
            "type": "FeatureCollection",
            "features": features,
        }

        return SpatialRepository._geometry_cache

    def map_observations(
        self,
        timestamp: str,
    ) -> dict:

        root = Path(__file__).resolve().parents[3]
        observations = (
            pl.scan_parquet(
                root
                / "data"
                / "processed"
                / "spi"
                / "spi3.parquet"
            )
            .filter(
                pl.col("timestamp") == timestamp
            )
            .collect()
)

        joined = (
            SpatialRepository._h3.join(
                observations,
                on="h3_id",
                how="inner",
            )
        )

        features = []

        for row in joined.iter_rows(
            named=True,
        ):

            features.append(
                {
                    "type": "Feature",
                    "geometry": mapping(
                        from_wkb(
                            row["geometry"]
                        )
                    ),
                    "properties": {
                        key: value
                        for key, value in row.items()
                        if key != "geometry"
                    },
                }
            )

        return {
            "type": "FeatureCollection",
            "features": features,
        }

    def map_discoveries(
        self,
        timestamp: str | None = None,
    ) -> dict:

        #
        # Return cached GeoJSON whenever possible.
        #
        if (
            SpatialRepository._geojson_cache
            is not None
        ):
            return SpatialRepository._geojson_cache

        discoveries = pl.DataFrame(
            self._repository.discoveries(
                timestamp=timestamp,
            )
        )

        joined = (
            SpatialRepository._h3.join(
                discoveries,
                on="h3_id",
                how="inner",
            )
        )
        print("\n===== H3 JOINED COLUMNS =====")
        print(joined.columns)

        print("\n===== SAMPLE ROW =====")
        print(joined.head())

        features = []

        for row in joined.iter_rows(
            named=True,
        ):

            features.append(
                {
                    "type": "Feature",
                    "geometry": mapping(
                        from_wkb(
                            row["geometry"]
                        )
                    ),
                    "properties": {
                        key: value
                        for key, value in row.items()
                        if key != "geometry"
                    },
                }
            )

        SpatialRepository._geojson_cache = {
            "type": "FeatureCollection",
            "features": features,
        }

        return SpatialRepository._geojson_cache

    @classmethod
    def clear_cache(
        cls,
    ) -> None:
        """
        Clear cached spatial data.

        Useful during development or
        after rebuilding discoveries.
        """

        cls._geojson_cache = None
        cls._geometry_cache = None

    def map_spi(
        self,
        timestamp: str,
    ) -> list[dict]:

        root = Path(__file__).resolve().parents[3]

        observations = (
            pl.scan_parquet(
                root
                / "data"
                / "processed"
                / "spi"
                / "spi3.parquet"
            )
            .filter(
                pl.col("timestamp") == timestamp
            )
            .select(
                [
                    "h3_id",
                    "spi3",
                    "timestamp",
                ]
            )
            .collect()
        )

        rows = observations.to_dicts()

        for row in rows:
            value = row["spi3"]

            if value is None:
                continue

            if value != value:
                row["spi3"] = None

        return rows