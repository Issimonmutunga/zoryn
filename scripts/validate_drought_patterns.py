"""
Validate WMO persistent dryness pattern discovery.
"""

from __future__ import annotations

from pathlib import Path

import polars as pl

from zoryn.knowledge import (
    EvidenceBuilder,
    EvidenceStore,
    ObservationStore,
    PersistentDrynessRule,
    SignatureBuilder,
    SignatureComparator,
)

from zoryn.replay import ReplayEngine


def main() -> None:

    print("=" * 70)
    print("LOADING OBSERVATIONS")
    print("=" * 70)

    observations = pl.scan_parquet(
        Path(
            "data/processed/observations/"
            "master_observations.parquet"
        )
    )

    store = ObservationStore(
        observations
    )

    histories = sum(
        1
        for _ in store.histories()
    )

    print(
        f"Histories : {histories:,}"
    )

    print("=" * 70)
    print("BUILDING EVIDENCE")
    print("=" * 70)

    builder = SignatureBuilder(
        store
    )

    replay = ReplayEngine(
        builder
    )

    comparator = SignatureComparator()

    evidence_builder = EvidenceBuilder()

    evidence: list = []

    relationships = 0

    for index, (_, history) in enumerate(
        replay.histories(),
        start=1,
    ):

        previous = None

        for signature in history:

            if previous is None:

                previous = signature
                continue

            relationship = comparator.compare(
                previous,
                signature,
            )

            relationships += 1

            evidence.extend(
                evidence_builder.build(
                    relationship
                )
            )

            previous = signature

        if index % 5000 == 0:

            print(
                f"{index:,}/{histories:,} histories | "
                f"{relationships:,} relationships | "
                f"{len(evidence):,} evidence"
            )

    evidence_store = EvidenceStore(
        evidence
    )

    print("=" * 70)
    print("DISCOVERING DROUGHT PATTERNS")
    print("=" * 70)

    rule = PersistentDrynessRule()

    patterns = rule.discover(
        evidence_store
    )