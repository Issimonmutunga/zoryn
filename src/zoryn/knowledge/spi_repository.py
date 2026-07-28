"""
SPI repository.

Provides fast lookup of SPI values for a given
H3 cell and timestamp.
"""

from __future__ import annotations

from pathlib import Path

import polars as pl


class SPIRepository:
    """
    Cached repository for SPI values.
    """

    _spi3_index: dict[
        tuple[str, str],
        float,
    ] | None = None

    _spi6_index: dict[
        tuple[str, str],
        float,
    ] | None = None

    _spi12_index: dict[
        tuple[str, str],
        float,
    ] | None = None

    def __init__(
        self,
    ) -> None:

        if (
            SPIRepository._spi3_index
            is not None
        ):
            return

        root = (
            Path(__file__)
            .resolve()
            .parents[3]
            / "data"
            / "processed"
            / "spi"
        )

        SPIRepository._spi3_index = (
            self._build_index(
                pl.read_parquet(
                    root
                    / "spi3.parquet"
                ),
                "spi3",
            )
        )

        SPIRepository._spi6_index = (
            self._build_index(
                pl.read_parquet(
                    root
                    / "spi6.parquet"
                ),
                "spi6",
            )
        )

        SPIRepository._spi12_index = (
            self._build_index(
                pl.read_parquet(
                    root
                    / "spi12.parquet"
                ),
                "spi12",
            )
        )

    @staticmethod
    def _build_index(
        table: pl.DataFrame,
        column: str,
    ) -> dict[
        tuple[str, str],
        float,
    ]:

        index: dict[
            tuple[str, str],
            float,
        ] = {}

        for row in table.iter_rows(
            named=True,
        ):

            index[
                (
                    row["h3_id"],
                    row["timestamp"],
                )
            ] = row[column]

        return index

    def lookup(
        self,
        h3_id: str,
        timestamp: str,
    ) -> dict[
        str,
        float | None,
    ]:
        """
        Return SPI values for a given
        H3 cell and timestamp.
        """

        key = (
            h3_id,
            timestamp,
        )

        return {
            "spi3":
                self._spi3_index.get(
                    key,
                ),
            "spi6":
                self._spi6_index.get(
                    key,
                ),
            "spi12":
                self._spi12_index.get(
                    key,
                ),
        }