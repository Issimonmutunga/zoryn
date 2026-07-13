"""
Validate the exported knowledge dataset.
"""

from __future__ import annotations

from pathlib import Path

import polars as pl


LINE = "=" * 70


def load_table(
    root: Path,
    table: str,
) -> pl.DataFrame:
    """
    Load a partitioned knowledge table.
    """

    directory = root / table

    if not directory.exists():
        raise FileNotFoundError(directory)

    files = sorted(
        directory.glob("*.parquet")
    )

    if not files:
        raise RuntimeError(
            f"No parquet files found for {table}."
        )

    return pl.concat(
        [
            pl.read_parquet(file)
            for file in files
        ]
    )


def main() -> None:

    root = Path(
        "data/processed/knowledge"
    )

    report_dir = Path(
        "data/validation/knowledge"
    )

    report_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    report = (
        report_dir
        / "validate_knowledge.txt"
    )

    print(LINE)
    print("LOADING KNOWLEDGE DATASET")
    print(LINE)

    discoveries = load_table(
        root,
        "discoveries",
    )

    hypotheses = load_table(
        root,
        "hypotheses",
    )

    patterns = load_table(
        root,
        "patterns",
    )

    evidence = load_table(
        root,
        "evidence",
    )

    hypothesis_patterns = load_table(
        root,
        "hypothesis_patterns",
    )

    pattern_evidence = load_table(
        root,
        "pattern_evidence",
    )

    print(LINE)
    print("VALIDATING KNOWLEDGE")
    print(LINE)

    #
    # Duplicate IDs
    #

    assert discoveries["id"].n_unique() == len(
        discoveries
    )

    assert hypotheses["id"].n_unique() == len(
        hypotheses
    )

    assert patterns["id"].n_unique() == len(
        patterns
    )

    assert evidence["id"].n_unique() == len(
        evidence
    )

    #
    # Foreign keys
    #

    hypothesis_ids = set(
        hypotheses["id"].to_list()
    )

    pattern_ids = set(
        patterns["id"].to_list()
    )

    evidence_ids = set(
        evidence["id"].to_list()
    )

    for row in hypothesis_patterns.iter_rows(
        named=True
    ):

        assert (
            row["hypothesis_id"]
            in hypothesis_ids
        )

        assert (
            row["pattern_id"]
            in pattern_ids
        )

    for row in pattern_evidence.iter_rows(
        named=True
    ):

        assert (
            row["pattern_id"]
            in pattern_ids
        )

        assert (
            row["evidence_id"]
            in evidence_ids
        )

    #
    # Report
    #

    lines = [
        LINE,
        "KNOWLEDGE VALIDATION",
        LINE,
        f"Discoveries         : {len(discoveries):,}",
        f"Hypotheses         : {len(hypotheses):,}",
        f"Patterns           : {len(patterns):,}",
        f"Evidence           : {len(evidence):,}",
        (
            "Hypothesis Links   : "
            f"{len(hypothesis_patterns):,}"
        ),
        (
            "Pattern Links      : "
            f"{len(pattern_evidence):,}"
        ),
        LINE,
        "VALIDATION PASSED",
        LINE,
    ]

    report.write_text(
        "\n".join(lines),
        encoding="utf-8",
    )

    for line in lines:

        print(line)

    print(
        "Report written to:"
    )

    print(
        report.resolve()
    )


if __name__ == "__main__":

    main()