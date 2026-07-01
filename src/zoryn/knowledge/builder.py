"""
Builds immutable Signature objects from canonical observations.
"""

from __future__ import annotations

from collections.abc import Iterator

import polars as pl

from .signature import Signature
from .store import ObservationStore


class SignatureBuilder:
    """
    Builds Signature objects from an ObservationStore.
    """

    def __init__(
        self,
        store: ObservationStore,
    ) -> None:

        self._store = store

    def build(
        self,
        *,
        timestamp: str,
        h3_id: str,
    ) -> Signature:
        """
        Build a Signature for one H3 cell at one timestamp.
        """

        df = self._store.query(
            timestamp=timestamp,
            h3_id=h3_id,
        )

        if df.is_empty():
            raise ValueError(
                f"No observations found for "
                f"{timestamp=} {h3_id=}."
            )

        duplicates = (
            df.group_by("variable")
            .len()
            .filter(pl.col("len") > 1)
        )

        if duplicates.height > 0:
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

    def iter_histories(
        self,
    ) -> Iterator[
        tuple[str, Iterator[Signature]]
    ]:
        """
        Iterate through the temporal history of every H3 cell.

        Yields
        ------
        (h3_id, iterator of Signature)
        """

        for (
            h3_id,
            observations,
        ) in self._store.histories():

            yield (
                h3_id,
                self._build_history(
                    h3_id,
                    observations,
                ),
            )

    def _build_history(
        self,
        h3_id: str,
        observations: pl.DataFrame,
    ) -> Iterator[Signature]:
        """
        Lazily build one H3 history.
        """

        for frame in observations.partition_by(
            "timestamp",
            maintain_order=True,
        ):

            variables = dict(
                zip(
                    frame["variable"],
                    frame["value"],
                )
            )

            yield Signature(
                timestamp=frame["timestamp"][0],
                h3_id=h3_id,
                variables=variables,
            )