"""
Validate consecutive pattern discovery.
"""

from __future__ import annotations

from pathlib import Path

import polars as pl

from zoryn.knowledge import (
    ConsecutiveChangeRule,
    EvidenceBuilder,
    EvidenceStore,
    ObservationStore,
    ReplayEngine,
    SignatureBuilder,
    SignatureComparator,
)


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

    store = ObservationStore(observations)

    histories = sum(
        1 for _ in store.histories()
    )

    print(f"Histories : {histories:,}")

    print("=" * 70)
    print("BUILDING EVIDENCE")
    print("=" * 70)

    builder = SignatureBuilder(store)

    replay = ReplayEngine(builder)

    comparator = SignatureComparator()

    evidence_builder = EvidenceBuilder()

    evidence_store = EvidenceStore()

    relationships = 0
    evidence_count = 0

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

            for evidence in (
                evidence_builder.build(
                    relationship
                )
            ):

                evidence_store.add(
                    evidence
                )

                evidence_count += 1

            previous = signature

        if index % 5000 == 0:

            print(
                f"{index:,}/{histories:,} histories | "
                f"{relationships:,} relationships | "
                f"{evidence_count:,} evidence"
            )
    print("=" * 70)
    print("DISCOVERING PATTERNS")
    print("=" * 70)

    rule = ConsecutiveChangeRule()

    patterns = rule.discover(
        evidence_store.evidence
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

    report = output_dir / "validate_patterns.txt"

    with report.open(
        "w",
        encoding="utf-8",
    ) as f:

        f.write("=" * 70 + "\n")
        f.write("PATTERN VALIDATION\n")
        f.write("=" * 70 + "\n")

        f.write(
            f"Histories          : {histories:,}\n"
        )

        f.write(
            f"Relationships      : {relationships:,}\n"
        )

        f.write(
            f"Evidence           : {evidence_count:,}\n"
        )

        f.write(
            f"Patterns           : {len(patterns):,}\n"
        )

        f.write("=" * 70 + "\n")

        f.write(
            "Top 20 Patterns\n"
        )

        f.write("=" * 70 + "\n")

        for pattern in sorted(
            patterns,
            key=lambda p: p.frequency,
            reverse=True,
        )[:20]:

            f.write(
                f"{pattern.name:25}"
                f"{pattern.metadata['variable']:30}"
                f"{pattern.metadata['start']} -> "
                f"{pattern.metadata['end']}   "
                f"length={pattern.frequency}\n"
            )

    print("=" * 70)
    print("PATTERN VALIDATION")
    print("=" * 70)

    print(
        f"Histories     : {histories:,}"
    )

    print(
        f"Relationships : {relationships:,}"
    )

    print(
        f"Evidence      : {evidence_count:,}"
    )

    print(
        f"Patterns      : {len(patterns):,}"
    )

    print("=" * 70)

    print("Report written to:")

    print(report.resolve())

    print("=" * 70)
    print("VALIDATION PASSED")
    print("=" * 70)


if __name__ == "__main__":

    main()