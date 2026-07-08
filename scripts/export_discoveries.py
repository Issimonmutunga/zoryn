"""
Export environmental discoveries to Parquet.
"""

from __future__ import annotations

from pathlib import Path

import polars as pl

from zoryn.rest import Zoryn


def main() -> None:

    observations = Path(
        "data/processed/observations/"
        "master_observations.parquet"
    )

    print("=" * 70)
    print("RUNNING ZORYN")
    print("=" * 70)

    runtime = Zoryn(
        observations
    )

    discoveries = runtime.run()

    print(
        f"Discoveries : {len(discoveries):,}"
    )

    print("=" * 70)
    print("BUILDING TABLE")
    print("=" * 70)

    rows = []

    for discovery in discoveries:

        hypothesis = discovery.hypothesis

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

    dataframe = pl.DataFrame(
        rows
    )
    output_dir = Path(
        "data/processed/discoveries"
    )

    output_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    output = (
        output_dir
        / "discoveries.parquet"
    )

    print("=" * 70)
    print("WRITING DISCOVERIES")
    print("=" * 70)

    dataframe.write_parquet(
        output
    )

    print("=" * 70)
    print("EXPORT COMPLETE")
    print("=" * 70)

    print(
        f"Discoveries : {len(dataframe):,}"
    )

    print("Output:")

    print(
        output.resolve()
    )

    print("=" * 70)

    print(
        dataframe.head(10)
    )


if __name__ == "__main__":

    main()