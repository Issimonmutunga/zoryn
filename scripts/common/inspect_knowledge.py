"""
Inspect the persisted knowledge dataset.

Usage
-----
python scripts/inspect_knowledge.py

Optionally inspect a specific H3:

python scripts/inspect_knowledge.py 8a7a6e406117fff
"""

from __future__ import annotations

import sys
from pathlib import Path

import polars as pl


ROOT = Path(__file__).resolve().parents[2]

KNOWLEDGE = (
    ROOT
    / "data"
    / "processed"
    / "knowledge"
)


def load_table(
    name: str,
) -> pl.DataFrame:

    directory = KNOWLEDGE / name

    files = sorted(
        directory.glob(
            "*.parquet",
        )
    )

    if not files:
        raise FileNotFoundError(
            f"No parquet files found for {name}"
        )

    return pl.concat(
        [
            pl.read_parquet(file)
            for file in files
        ]
    )


def main() -> None:

    discoveries = load_table(
        "discoveries",
    )

    print("\n========== DISCOVERIES ==========\n")

    print(
        f"Rows: {discoveries.height:,}"
    )

    print(
        "Unique H3:",
        discoveries
        .select(
            pl.col("h3_id")
            .n_unique()
        )
        .item(),
    )

    timestamps = (
        discoveries
        .select("timestamp")
        .unique()
        .sort("timestamp")
    )

    print(
        "Unique timestamps:",
        timestamps.height,
    )

    print(
        "First:",
        timestamps[0, "timestamp"],
    )

    print(
        "Last:",
        timestamps[
            timestamps.height - 1,
            "timestamp",
        ],
    )

    print("\nSample timestamps\n")

    print(
        timestamps.head(10)
    )

    print("\nDiscoveries per H3\n")

    counts = (
        discoveries
        .group_by("h3_id")
        .len()
        .rename(
            {"len": "count"}
        )
    )

    print(
        counts
        .select(
            [
                pl.col("count").min(),
                pl.col("count").mean(),
                pl.col("count").max(),
            ]
        )
    )

    if len(sys.argv) > 1:

        h3_id = sys.argv[1]

        print(
            f"\n========== {h3_id} ==========\n"
        )

        rows = (
            discoveries
            .filter(
                pl.col("h3_id") == h3_id
            )
            .sort("timestamp")
        )

        print(rows)

    print(
        "\nDone."
    )


if __name__ == "__main__":
    main()