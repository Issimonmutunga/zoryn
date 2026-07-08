"""
Validate exported discoveries.
"""

from __future__ import annotations

from pathlib import Path

import polars as pl


def main() -> None:

    discoveries = Path(
        "data/processed/discoveries/"
        "discoveries.parquet"
    )

    if not discoveries.exists():

        raise FileNotFoundError(
            discoveries
        )

    print("=" * 70)
    print("LOADING DISCOVERIES")
    print("=" * 70)

    dataframe = pl.read_parquet(
        discoveries
    )

    print(
        f"Rows : {len(dataframe):,}"
    )

    required_columns = {
        "h3_id",
        "discovery",
        "confidence",
        "start",
        "end",
        "variables",
        "hypothesis",
        "pattern",
        "pattern_frequency",
        "standard",
    }

    print("=" * 70)
    print("VALIDATING DATASET")
    print("=" * 70)

    missing = (
        required_columns
        - set(dataframe.columns)
    )

    if missing:

        raise ValueError(
            f"Missing columns: {sorted(missing)}"
        )

    null_h3 = (
        dataframe
        .select(
            pl.col("h3_id").is_null().sum()
        )
        .item()
    )

    null_discovery = (
        dataframe
        .select(
            pl.col("discovery").is_null().sum()
        )
        .item()
    )

    invalid_confidence = (
        dataframe.filter(
            (pl.col("confidence") < 0.0)
            |
            (pl.col("confidence") > 1.0)
        ).height
    )
    print(
        f"Missing Columns      : {len(missing)}"
    )

    print(
        f"Null H3 IDs          : {null_h3:,}"
    )

    print(
        f"Null Discoveries     : {null_discovery:,}"
    )

    print(
        f"Invalid Confidence   : {invalid_confidence:,}"
    )

    output_dir = Path(
        "data/validation/discoveries"
    )

    output_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    report = (
        output_dir
        / "validate_discoveries.txt"
    )

    with report.open(
        "w",
        encoding="utf-8",
    ) as f:

        f.write("=" * 70 + "\n")
        f.write("DISCOVERY DATASET VALIDATION\n")
        f.write("=" * 70 + "\n")

        f.write(
            f"Rows                 : {len(dataframe):,}\n"
        )

        f.write(
            f"Columns              : {len(dataframe.columns)}\n"
        )

        f.write(
            f"Missing Columns      : {len(missing)}\n"
        )

        f.write(
            f"Null H3 IDs          : {null_h3:,}\n"
        )

        f.write(
            f"Null Discoveries     : {null_discovery:,}\n"
        )

        f.write(
            f"Invalid Confidence   : {invalid_confidence:,}\n"
        )

        f.write("=" * 70 + "\n")

    print("=" * 70)
    print("VALIDATION PASSED")
    print("=" * 70)

    print("Report written to:")

    print(
        report.resolve()
    )


if __name__ == "__main__":

    main()