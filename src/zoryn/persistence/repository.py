"""
Knowledge graph repository.

Persists knowledge bundles.
"""

from __future__ import annotations

from dataclasses import asdict
from pathlib import Path

import polars as pl

from .schema import KnowledgeBundle


class KnowledgeRepository:
    """
    Persist knowledge bundles.
    """

    def __init__(
        self,
        root: Path,
    ) -> None:

        self._root = Path(
            root
        )

        self._root.mkdir(
            parents=True,
            exist_ok=True,
        )

    def save(
        self,
        bundle: KnowledgeBundle,
    ) -> None:
        """
        Persist one knowledge bundle.
        """

        self._append(
            "discoveries.parquet",
            bundle.discoveries,
        )

        self._append(
            "hypotheses.parquet",
            bundle.hypotheses,
        )

        self._append(
            "hypothesis_patterns.parquet",
            bundle.hypothesis_patterns,
        )

        self._append(
            "patterns.parquet",
            bundle.patterns,
        )

        self._append(
            "pattern_evidence.parquet",
            bundle.pattern_evidence,
        )

        self._append(
            "evidence.parquet",
            bundle.evidence,
        )

    def _append(
        self,
        filename: str,
        records: list,
    ) -> None:
        """
        Append records to a Parquet dataset.
        """

        if not records:
            return

        path = (
            self._root
            / filename
        )

        dataframe = pl.DataFrame(
            [
                asdict(record)
                for record in records
            ]
        )

        if path.exists():

            existing = pl.read_parquet(
                path
            )

            dataframe = pl.concat(
                [
                    existing,
                    dataframe,
                ],
                how="vertical",
            )

        dataframe.write_parquet(
            path
        )