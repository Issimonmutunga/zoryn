"""
Export environmental discoveries to Parquet.

The exporter consumes discoveries as a stream from the knowledge engine and
writes them in bounded-memory Parquet batches.
"""

from __future__ import annotations

from pathlib import Path

import polars as pl

from zoryn.api import Zoryn


BATCH_SIZE = 5_000


def _write_batch(
    rows: list[dict],
    output_dir: Path,
    batch_number: int,
) -> None:
    """
    Write one Parquet batch.
    """

    if not rows:
        return

    output = (
        output_dir
        / f"discoveries_part_{batch_number:06d}.parquet"
    )

    pl.DataFrame(rows).write_parquet(output)


def main() -> None:

    observations = Path(
        "data/processed/observations/"
        "master_observations.parquet"
    )

    output_dir = Path(
        "data/processed/discoveries"
    )

    output_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    print("=" * 70)
    print("RUNNING ZORYN")
    print("=" * 70)

    runtime = Zoryn(
        observations
    )

    rows: list[dict] = []

    batch_number = 1
    discovery_count = 0

    print("=" * 70)
    print("EXPORTING DISCOVERIES")
    print("=" * 70)

    for discovery in runtime.run():

        hypothesis = discovery.hypothesis

        if not hypothesis.patterns:
            continue

        pattern = hypothesis.patterns[0]

        rows.append(
            {
                "h3_id": discovery.h3_id,
                "discovery": discovery.name,
                "confidence": discovery.confidence,
                "start": discovery.start,
                "end": discovery.end,
                "variables": ",".join(
                    discovery.variables
                ),
                "hypothesis": hypothesis.name,
                "pattern": pattern.name,
                "pattern_frequency": (
                    pattern.frequency
                ),
                "standard": (
                    pattern.metadata.get(
                        "standard"
                    )
                ),
            }
        )

        discovery_count += 1

        if len(rows) >= BATCH_SIZE:

            _write_batch(
                rows,
                output_dir,
                batch_number,
            )

            print(
                f"Wrote batch {batch_number:,} "
                f"({len(rows):,} discoveries)"
            )

            rows.clear()
            batch_number += 1

    if rows:

        _write_batch(
            rows,
            output_dir,
            batch_number,
        )

        print(
            f"Wrote batch {batch_number:,} "
            f"({len(rows):,} discoveries)"
        )

    print("=" * 70)
    print("EXPORT COMPLETE")
    print("=" * 70)

    print(
        f"Total discoveries: {discovery_count:,}"
    )

    print("Output directory:")

    print(
        output_dir.resolve()
    )

    print("=" * 70)


if __name__ == "__main__":

    main()