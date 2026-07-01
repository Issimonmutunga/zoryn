"""
Builds immutable Signature objects from canonical observations.
"""

from __future__ import annotations

from collections.abc import Iterator

import polars as pl

from .signature import Signature


class SignatureBuilder:
    """
    Builds Signature objects from canonical observations.

    Expected schema:

        timestamp
        h3_id
        variable
        value
        source
    """

    REQUIRED_COLUMNS = (
        "timestamp",
        "h3_id",
        "variable",
        "value",
        "source",
    )

    def __init__(self, observations: pl.LazyFrame):

        self._observations = observations

        schema = tuple(
            observations.collect_schema().names()
        )

        if schema != self.REQUIRED_COLUMNS:
            raise ValueError(
                f"Expected schema {self.REQUIRED_COLUMNS}, "
                f"received {schema}."
            )

    def build(
        self,
        timestamp: str,
        h3_id: str,
    ) -> Signature:
        """
        Build one Signature.
        """

        df = (
            self._observations
            .filter(
                (pl.col("timestamp") == timestamp)
                &
                (pl.col("h3_id") == h3_id)
            )
            .collect()
        )

        if df.is_empty():
            raise ValueError(
                f"No observations found for "
                f"{timestamp=} {h3_id=}."
            )

        if (
            df.group_by("variable")
            .len()
            .filter(pl.col("len") > 1)
            .height
            > 0
        ):
            raise ValueError(
                "Duplicate variables detected."
            )

        variables = dict(
            zip(
                df["variable"],
                df["value"],
            )
        )

        return Signature(
            timestamp=timestamp,
            h3_id=h3_id,
            variables=variables,
        )

    def iter_signatures(
        self,
    ) -> Iterator[Signature]:
        """
        Iterate through every signature.
        """

        grouped = (
            self._observations
            .group_by(
                [
                    "timestamp",
                    "h3_id",
                ]
            )
            .agg(
                [
                    pl.col("variable"),
                    pl.col("value"),
                ]
            )
            .collect()
        )

        for row in grouped.iter_rows(named=True):

            variables = dict(
                zip(
                    row["variable"],
                    row["value"],
                )
            )

            yield Signature(
                timestamp=row["timestamp"],
                h3_id=row["h3_id"],
                variables=variables,
            )
    def iter_histories(
        self,
    ) -> Iterator[tuple[str, Iterator[Signature]]]:
        """
        Iterate through the temporal history of each H3 cell.

        Yields
        ------
        (h3_id, iterator of Signatures)
        """

        grouped = (
            self._observations
            .sort(
                [
                    "h3_id",
                    "timestamp",
                ]
            )
            .group_by("h3_id")
        )

        for h3_id, frame in grouped:

            signatures = []

            temporal_groups = (
                frame
                .group_by("timestamp")
            )

            for timestamp, observations in temporal_groups:

                variables = dict(
                    zip(
                        observations["variable"],
                        observations["value"],
                    )
                )

                signatures.append(
                    Signature(
                        timestamp=timestamp,
                        h3_id=h3_id,
                        variables=variables,
                    )
                )

            yield h3_id, iter(signatures)