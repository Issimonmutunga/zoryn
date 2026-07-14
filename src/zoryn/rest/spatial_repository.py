"""
Spatial repository.

Provides spatial access to persisted H3 geometries for map visualisation.
"""

from __future__ import annotations

from pathlib import Path

import polars as pl
from shapely import from_wkb
from shapely.geometry import mapping

from .repository import KnowledgeRepository


class SpatialRepository:
    """
    Build spatial representations of the knowledge repository.
    """

    def __init__(
        self,
        repository: KnowledgeRepository,
    ) -> None:

        self._repository = repository

        root = Path(__file__).resolve().parents[3]

        self._h3 = pl.read_parquet(
            root
            / "data"
            / "processed"
            / "h3"
            / "pilot_nairobi_h3_res10.parquet"
        )

    def map_discoveries(
        self,
    ) -> dict:

        discoveries = pl.DataFrame(
            self._repository.discoveries()
        )

        joined = self._h3.join(
            discoveries,
            on="h3_id",
            how="inner",
        )

        features = []

        for row in joined.iter_rows(
            named=True,
        ):

            feature = {
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

            features.append(
                feature
            )

        return {
            "type": "FeatureCollection",
            "features": features,
        }