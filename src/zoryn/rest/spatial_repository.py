"""
Spatial repository.

Provides spatial access to persisted H3 geometries
for map visualisation.
"""

from __future__ import annotations

import json
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
    _months_cache: list[str] | None = None

    def __init__(
        self,
        repository: KnowledgeRepository,
    ) -> None:

        self._repository = repository

    def _h3_table(
        self,
    ) -> pl.DataFrame:
        """
        Return the cached H3 geometry table.
        """

        if SpatialRepository._h3 is not None:

            return SpatialRepository._h3

        root = Path(__file__).resolve().parents[3]

        SpatialRepository._h3 = pl.read_parquet(
            root
            / "data"
            / "processed"
            / "h3"
            / "pilot_nairobi_h3_res10.parquet"
        )

        return SpatialRepository._h3

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

        root = Path(__file__).resolve().parents[3]

        path = (
            root
            / "data"
            / "processed"
            / "h3"
            / "pilot_nairobi_h3_res10.geojson"
        )

        with open(path, "r", encoding="utf-8") as handle:
            SpatialRepository._geometry_cache = json.load(handle)

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
            self._h3_table().join(
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

        if (
            SpatialRepository._geojson_cache
            is not None
        ):
            return SpatialRepository._geojson_cache

        root = Path(__file__).resolve().parents[3]

        path = (
            root
            / "data"
            / "processed"
            / "h3"
            / "pilot_nairobi_discoveries.geojson"
        )

        with open(
            path,
            encoding="utf-8",
        ) as handle:

            SpatialRepository._geojson_cache = json.load(
                handle,
            )

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
        cls._months_cache = None

    def map_months(
        self,
    ) -> list[str]:
        """
        Months, oldest first, for which at least one cell
        has a defined SPI-3 value.
        """

        if SpatialRepository._months_cache is not None:

            return SpatialRepository._months_cache

        root = Path(__file__).resolve().parents[3]

        months = (
            pl.scan_parquet(
                root
                / "data"
                / "processed"
                / "spi"
                / "spi3.parquet"
            )
            .filter(
                pl.col("spi3").is_not_null()
                & pl.col("spi3").is_not_nan()
            )
            .select(
                pl.col("timestamp").unique().sort()
            )
            .collect()
        )

        SpatialRepository._months_cache = (
            months["timestamp"].to_list()
        )

        return SpatialRepository._months_cache

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