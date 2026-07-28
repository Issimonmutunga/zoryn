"""
Knowledge repository.

Provides read access to the persisted knowledge dataset.
"""

from __future__ import annotations

import math
from pathlib import Path

import polars as pl


class KnowledgeRepository:
    """
    Read persisted knowledge.
    """

    def __init__(
        self,
        root: Path,
    ) -> None:

        self._root = root

        self._discoveries: pl.DataFrame | None = None
        self._hypotheses: pl.DataFrame | None = None
        self._patterns: pl.DataFrame | None = None
        self._evidence: pl.DataFrame | None = None
        self._hypothesis_patterns: pl.DataFrame | None = None
        self._pattern_evidence: pl.DataFrame | None = None

    def _load(
        self,
        table: str,
    ) -> pl.DataFrame:
        """
        Load a partitioned knowledge table.
        """

        directory = self._root / table

        files = sorted(
            directory.glob(
                "*.parquet"
            )
        )

        if not files:

            raise FileNotFoundError(
                f"No parquet files found for {table}."
            )

        return (
            pl.scan_parquet(
                [str(file) for file in files]
            )
            .collect()
        )

    @property
    def discoveries_table(
        self,
    ) -> pl.DataFrame:

        if self._discoveries is None:
            self._discoveries = self._load(
                "discoveries"
            )

        return self._discoveries

    @property
    def hypotheses_table(
        self,
    ) -> pl.DataFrame:

        if self._hypotheses is None:
            self._hypotheses = self._load(
                "hypotheses"
            )

        return self._hypotheses

    @property
    def patterns_table(
        self,
    ) -> pl.DataFrame:

        if self._patterns is None:
            self._patterns = self._load(
                "patterns"
            )

        return self._patterns

    @property
    def evidence_table(
        self,
    ) -> pl.DataFrame:

        if self._evidence is None:
            self._evidence = self._load(
                "evidence"
            )

        return self._evidence

    @property
    def hypothesis_patterns_table(
        self,
    ) -> pl.DataFrame:

        if self._hypothesis_patterns is None:
            self._hypothesis_patterns = self._load(
                "hypothesis_patterns"
            )

        return self._hypothesis_patterns

    @property
    def pattern_evidence_table(
        self,
    ) -> pl.DataFrame:

        if self._pattern_evidence is None:
            self._pattern_evidence = self._load(
                "pattern_evidence"
            )

        return self._pattern_evidence

    def _sanitize(
        self,
        value,
    ):
        """
        Replace NaN values with None so responses
        are JSON serializable.
        """

        if isinstance(value, dict):
            return {
                key: self._sanitize(val)
                for key, val in value.items()
            }

        if isinstance(value, list):
            return [
                self._sanitize(item)
                for item in value
            ]

        if (
            isinstance(value, float)
            and math.isnan(value)
        ):
            return None

        return value

    def discoveries(
        self,
        timestamp: str | None = None,
    ) -> list[dict]:

        rows = self.discoveries_table

        if timestamp is not None:
            rows = rows.filter(
                pl.col("timestamp") == timestamp
            )

        return self._sanitize(
            rows.to_dicts()
        )

    def discovery(
        self,
        h3_id: str,
        timestamp: str | None = None,
    ) -> dict | None:

        rows = self.discoveries_table.filter(
            pl.col("h3_id") == h3_id
        )

        if timestamp is not None:

            rows = rows.filter(
                pl.col("timestamp") == timestamp
            )

        if rows.is_empty():

            return None

        return self._sanitize(
            rows.to_dicts()[0]
        )

    def discovery_timeline(
        self,
    ) -> list[dict]:
        """
        Return the number of discoveries
        available for each timestamp.
        """

        return (
            self.discoveries_table
            .group_by("timestamp")
            .len()
            .rename(
                {"len": "discoveries"}
            )
            .sort("timestamp")
            .to_dicts()
        )

    def discovery_highlights(
        self,
        timestamp: str,
    ) -> list[dict]:
        """
        Return H3 cells that contain discoveries for
        the selected timestamp.
        """

        rows = self.discoveries_table.filter(
            pl.col("timestamp") == timestamp,
        )

        return self._sanitize(
            rows
            .select(["h3_id"])
            .unique()
            .sort("h3_id")
            .to_dicts()
        )

    def hypothesis(
        self,
        hypothesis_id: str,
    ) -> dict | None:

        rows = self.hypotheses_table.filter(
            pl.col("id") == hypothesis_id
        )

        if rows.is_empty():

            return None

        return self._sanitize(
            rows.to_dicts()[0]
        )

    def patterns(
        self,
        hypothesis_id: str,
    ) -> list[dict]:

        links = self.hypothesis_patterns_table.filter(
            pl.col(
                "hypothesis_id"
            ) == hypothesis_id
        )

        if links.is_empty():

            return []

        ids = links[
            "pattern_id"
        ].to_list()

        return self._sanitize(
            self.patterns_table.filter(
                pl.col("id").is_in(ids)
            ).to_dicts()
        )

    def evidence(
        self,
        pattern_id: str,
    ) -> list[dict]:

        links = self.pattern_evidence_table.filter(
            pl.col(
                "pattern_id"
            ) == pattern_id
        )

        if links.is_empty():

            return []

        ids = links[
            "evidence_id"
        ].to_list()

        return self._sanitize(
            self.evidence_table.filter(
                pl.col("id").is_in(ids)
            ).to_dicts()
        )

    def reasoning(
        self,
        h3_id: str,
        timestamp: str | None = None,
    ) -> dict | None:
        """
        Return the complete deterministic reasoning graph
        used by the Explorer UI.
        """

        discovery = self.discovery(
            h3_id,
            timestamp=timestamp,
        )

        if discovery is None:

            return None

        hypothesis = self.hypothesis(
            discovery[
                "hypothesis_id"
            ]
        )

        if hypothesis is None:

            return None

        patterns = self.patterns(
            hypothesis["id"]
        )

        evidence: list[dict] = []

        for pattern in patterns:

            evidence.extend(
                self.evidence(
                    pattern["id"]
                )
            )

        return self._sanitize(
            {
                "discovery": discovery,
                "hypothesis": hypothesis,
                "patterns": patterns,
                "evidence": evidence,
            }
        )