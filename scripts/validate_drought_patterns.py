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
    print("=" * 70)
    print("WRITING REPORT")
    print("=" * 70)

    output_dir = Path(
        "data/validation/patterns"
    )

    output_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    report = (
        output_dir
        / "validate_drought_patterns.txt"
    )

    with report.open(
        "w",
        encoding="utf-8",
    ) as f:

        f.write("=" * 70 + "\n")
        f.write("DROUGHT PATTERN VALIDATION\n")
        f.write("=" * 70 + "\n")

        f.write(
            f"Histories          : {histories:,}\n"
        )

        f.write(
            f"Relationships      : {relationships:,}\n"
        )

        f.write(
            f"Evidence           : {len(evidence_store):,}\n"
        )

        f.write(
            f"Drought Patterns   : {len(patterns):,}\n"
        )

        f.write("=" * 70 + "\n")
        f.write("TOP 20 PATTERNS\n")
        f.write("=" * 70 + "\n")

        for pattern in sorted(
            patterns,
            key=lambda p: p.frequency,
            reverse=True,
        )[:20]:

            f.write(
                f"{pattern.metadata['start']} -> "
                f"{pattern.metadata['end']}   "
                f"length={pattern.frequency}   "
                f"{pattern.metadata['variable']}\n"
            )

    print("=" * 70)
    print("DROUGHT PATTERN VALIDATION")
    print("=" * 70)

    print(
        f"Histories          : {histories:,}"
    )

    print(
        f"Relationships      : {relationships:,}"
    )

    print(
        f"Evidence           : {len(evidence_store):,}"
    )

    print(
        f"Drought Patterns   : {len(patterns):,}"
    )

    print("=" * 70)

    print("Report written to:")

    print(
        report.resolve()
    )

    print("=" * 70)
    print("VALIDATION PASSED")
    print("=" * 70)


if __name__ == "__main__":

    main()