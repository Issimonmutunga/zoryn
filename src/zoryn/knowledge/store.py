"""
Observation store.

Provides validated access to canonical observations.
"""

from __future__ import annotations

from collections.abc import Iterator

import polars as pl


class ObservationStore:
    """
    Read-only access to canonical observations.
    """

    REQUIRED_COLUMNS = (
        "timestamp",
        "h3_id",
        "variable",
        "value",
        "source",
    )

    def __init__(
        self,
        observations: pl.LazyFrame,
    ) -> None:

        self._observations = observations

        schema = tuple(
            observations.collect_schema().names()
        )

        if schema != self.REQUIRED_COLUMNS:
            raise ValueError(
                f"Expected schema "
                f"{self.REQUIRED_COLUMNS}, "
                f"received {schema}."
            )

    @property
    def observations(
        self,
    ) -> pl.LazyFrame:
        """
        Return the canonical observation source.
        """
        return self._observations

    def query(
        self,
        *,
        timestamp: str,
        h3_id: str,
    ) -> pl.DataFrame:
        """
        Return observations for one
        (timestamp, h3_id).
        """

        return (
            self._observations
            .filter(
                (pl.col("timestamp") == timestamp)
                &
                (pl.col("h3_id") == h3_id)
            )
            .collect()
        )

    def histories(
        self,
    ) -> Iterator[tuple[str, pl.DataFrame]]:
        """
        Iterate over temporal histories.

        Yields
        ------
        (h3_id, observations)
        """

        df = (
            self._observations
            .sort(
                [
                    "h3_id",
                    "timestamp",
                ]
            )
            .collect()
        )

        for history in (
            df.partition_by(
                "h3_id",
                maintain_order=True,
            )
        ):

            yield (
                history["h3_id"][0],
                history,
            )