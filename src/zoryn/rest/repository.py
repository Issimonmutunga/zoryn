"""
Knowledge repository.

Provides read access to the persisted knowledge dataset.
"""

from __future__ import annotations

import math

import polars as pl


class KnowledgeRepository:
    """
    Read persisted knowledge.
    """

    def __init__(
        self,
        knowledge: dict[str, pl.DataFrame],
    ) -> None:

        self._discoveries = knowledge[
            "discoveries"
        ]

        self._hypotheses = knowledge[
            "hypotheses"
        ]

        self._patterns = knowledge[
            "patterns"
        ]

        self._evidence = knowledge[
            "evidence"
        ]

        self._hypothesis_patterns = knowledge[
            "hypothesis_patterns"
        ]

        self._pattern_evidence = knowledge[
            "pattern_evidence"
        ]

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

        rows = self._discoveries

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

        rows = self._discoveries.filter(
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
            self._discoveries
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

        rows = self._discoveries.filter(
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

        rows = self._hypotheses.filter(
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

        links = self._hypothesis_patterns.filter(
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
            self._patterns.filter(
                pl.col("id").is_in(ids)
            ).to_dicts()
        )

    def evidence(
        self,
        pattern_id: str,
    ) -> list[dict]:

        links = self._pattern_evidence.filter(
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
            self._evidence.filter(
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