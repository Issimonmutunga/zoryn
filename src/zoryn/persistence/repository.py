"""
Knowledge graph repository.

Persists knowledge bundles.
"""

from __future__ import annotations

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

        self._root = Path(root)

        self._root.mkdir(
            parents=True,
            exist_ok=True,
        )

    def save(
        self,
        bundle: KnowledgeBundle,
    ) -> None:

        self._write(
            "discoveries.parquet",
            bundle.discoveries,
        )

        self._write(
            "hypotheses.parquet",
            bundle.hypotheses,
        )

        self._write(
            "hypothesis_patterns.parquet",
            bundle.hypothesis_patterns,
        )

        self._write(
            "patterns.parquet",
            bundle.patterns,
        )

        self._write(
            "pattern_evidence.parquet",
            bundle.pattern_evidence,
        )

        self._write(
            "evidence.parquet",
            bundle.evidence,
        )

    def _write(
        self,
        filename: str,
        records,
    ) -> None:

        if not records:
            return

        dataframe = pl.DataFrame(
            [
                record.__dict__
                for record in records
            ]
        )

        dataframe.write_parquet(
            self._root / filename
        )