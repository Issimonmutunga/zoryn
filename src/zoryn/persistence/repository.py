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

        #
        # Deduplication indices
        #

        self._seen_discoveries: set[str] = set()
        self._seen_hypotheses: set[str] = set()
        self._seen_patterns: set[str] = set()
        self._seen_evidence: set[str] = set()

        self._seen_hypothesis_patterns: set[
            tuple[str, str]
        ] = set()

        self._seen_pattern_evidence: set[
            tuple[str, str]
        ] = set()

    def add(
        self,
        bundle: KnowledgeBundle,
    ) -> None:
        """
        Add a bundle to the current batch.
        """

        #
        # Discoveries
        #

        for record in bundle.discoveries:

            if record.id in self._seen_discoveries:
                continue

            self._bundle.discoveries.append(
                record
            )

            self._seen_discoveries.add(
                record.id
            )

        #
        # Hypotheses
        #

        for record in bundle.hypotheses:

            if record.id in self._seen_hypotheses:
                continue

            self._bundle.hypotheses.append(
                record
            )

            self._seen_hypotheses.add(
                record.id
            )

        #
        # Patterns
        #

        for record in bundle.patterns:

            if record.id in self._seen_patterns:
                continue

            self._bundle.patterns.append(
                record
            )

            self._seen_patterns.add(
                record.id
            )

        #
        # Evidence
        #

        for record in bundle.evidence:

            if record.id in self._seen_evidence:
                continue

            self._bundle.evidence.append(
                record
            )

            self._seen_evidence.add(
                record.id
            )

        #
        # Hypothesis → Pattern
        #

        for record in bundle.hypothesis_patterns:

            key = (
                record.hypothesis_id,
                record.pattern_id,
            )

            if key in self._seen_hypothesis_patterns:
                continue

            self._bundle.hypothesis_patterns.append(
                record
            )

            self._seen_hypothesis_patterns.add(
                key
            )

        #
        # Pattern → Evidence
        #

        for record in bundle.pattern_evidence:

            key = (
                record.pattern_id,
                record.evidence_id,
            )

            if key in self._seen_pattern_evidence:
                continue

            self._bundle.pattern_evidence.append(
                record
            )

            self._seen_pattern_evidence.add(
                key
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

        #
        # Reset batch indices
        #

        self._seen_discoveries.clear()
        self._seen_hypotheses.clear()
        self._seen_patterns.clear()
        self._seen_evidence.clear()
        self._seen_hypothesis_patterns.clear()
        self._seen_pattern_evidence.clear()

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