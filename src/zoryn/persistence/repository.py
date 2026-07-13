"""
Knowledge graph repository.

Persists knowledge bundles in bounded-memory batches.
"""

from __future__ import annotations

from dataclasses import asdict
from pathlib import Path

import polars as pl

from .schema import KnowledgeBundle


class KnowledgeRepository:
    """
    Persist knowledge bundles as partitioned Parquet batches.
    """

    def __init__(
        self,
        root: Path,
        batch_size: int = 5_000,
    ) -> None:

        self._root = Path(root)
        self._batch_size = batch_size

        self._root.mkdir(
            parents=True,
            exist_ok=True,
        )

        self._bundle = KnowledgeBundle()

        self._batch = 1

        self._discoveries = 0

    def add(
        self,
        bundle: KnowledgeBundle,
    ) -> None:
        """
        Add a bundle to the current batch.
        """

        self._bundle.extend(
            bundle
        )

        self._discoveries += len(
            bundle.discoveries
        )

        if (
            self._discoveries
            >= self._batch_size
        ):

            self.flush()

    def flush(
        self,
    ) -> None:
        """
        Flush the current batch.
        """

        if not self._bundle.discoveries:
            return

        self._write(
            "discoveries",
            self._bundle.discoveries,
        )

        self._write(
            "hypotheses",
            self._bundle.hypotheses,
        )

        self._write(
            "hypothesis_patterns",
            self._bundle.hypothesis_patterns,
        )

        self._write(
            "patterns",
            self._bundle.patterns,
        )

        self._write(
            "pattern_evidence",
            self._bundle.pattern_evidence,
        )

        self._write(
            "evidence",
            self._bundle.evidence,
        )

        self._bundle.clear()

        self._discoveries = 0

        self._batch += 1

    def _write(
        self,
        table: str,
        records: list,
    ) -> None:

        if not records:
            return

        directory = (
            self._root
            / table
        )

        directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        output = (
            directory
            / f"part_{self._batch:06d}.parquet"
        )

        pl.DataFrame(
            [
                asdict(record)
                for record in records
            ]
        ).write_parquet(
            output
        )