"""
Knowledge repository.

Provides read access to the persisted knowledge dataset.
"""

from __future__ import annotations

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

    def discoveries(
        self,
    ) -> list[dict]:

        return (
            self._discoveries
            .to_dicts()
        )

    def discovery(
        self,
        h3_id: str,
    ) -> dict | None:

        rows = self._discoveries.filter(
            pl.col("h3_id") == h3_id
        )

        if rows.is_empty():

            return None

        return rows.to_dicts()[0]

    def hypothesis(
        self,
        hypothesis_id: str,
    ) -> dict | None:

        rows = self._hypotheses.filter(
            pl.col("id") == hypothesis_id
        )

        if rows.is_empty():

            return None

        return rows.to_dicts()[0]

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

        return (
            self._patterns.filter(
                pl.col("id").is_in(ids)
            )
            .to_dicts()
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

        return (
            self._evidence.filter(
                pl.col("id").is_in(ids)
            )
            .to_dicts()
        )

    def reasoning(
        self,
        h3_id: str,
    ) -> dict | None:

        discovery = self.discovery(
            h3_id
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

        evidence = []

        for pattern in patterns:

            evidence.extend(
                self.evidence(
                    pattern["id"]
                )
            )

        return {
            "discovery": discovery,
            "hypothesis": hypothesis,
            "patterns": patterns,
            "evidence": evidence,
        }