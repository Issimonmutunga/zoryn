"""
Runtime validation for Zoryn.

Validates the complete runtime pipeline using the canonical
master observations dataset.
"""

from __future__ import annotations

from pathlib import Path
from time import perf_counter

import polars as pl

from zoryn.knowledge.builder import SignatureBuilder
from zoryn.knowledge.comparator import SignatureComparator
from zoryn.knowledge.discoverer import KnowledgeDiscoverer
from zoryn.knowledge.store import ObservationStore
from zoryn.replay import ReplayEngine


PROJECT_ROOT = Path(__file__).resolve().parents[1]

MASTER_OBSERVATIONS = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "observations"
    / "master_observations.parquet"
)


def main() -> None:

    print("=" * 60)
    print("ZORYN RUNTIME VALIDATION")
    print("=" * 60)

    start = perf_counter()

    observations = pl.scan_parquet(
        MASTER_OBSERVATIONS
    )

    store = ObservationStore(observations)

    builder = SignatureBuilder(store)

    replay = ReplayEngine(builder)

    comparator = SignatureComparator()

    discoverer = KnowledgeDiscoverer()

    histories = 0
    signatures = 0
    relationships = 0

    for _, history in replay.histories():

        histories += 1

        previous = None

        for current in history:

            signatures += 1

            if previous is not None:

                relationship = comparator.compare(
                    previous,
                    current,
                )

                discoverer.consume(
                    [relationship]
                )

                relationships += 1

            previous = current

    elapsed = perf_counter() - start

    discoveries = discoverer.summary()

    print()
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Histories      : {histories:,}")
    print(f"Signatures     : {signatures:,}")
    print(f"Relationships  : {relationships:,}")
    print(f"Discoveries    : {len(discoveries):,}")
    print(f"Elapsed (sec)  : {elapsed:.2f}")
    print("=" * 60)

    if discoveries:

        print()
        print("Top discoveries:")

        for variable, count in sorted(
            discoveries.items(),
            key=lambda x: x[1],
            reverse=True,
        )[:10]:

            print(
                f"{variable:<35}"
                f"{count:>12,}"
            )


if __name__ == "__main__":
    main()