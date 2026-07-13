"""
Validate the knowledge repository.

Verifies that knowledge bundles are persisted as partitioned
Parquet datasets.
"""

from __future__ import annotations

import shutil
from pathlib import Path

from zoryn.api import Zoryn
from zoryn.persistence.repository import (
    KnowledgeRepository,
)
from zoryn.persistence.writer import (
    KnowledgeWriter,
)


LINE = "=" * 70


def main() -> None:

    observations = Path(
        "data/processed/observations/"
        "master_observations.parquet"
    )

    output = Path(
        "data/validation/repository"
    )

    if output.exists():

        shutil.rmtree(
            output
        )

    print(LINE)
    print("RUNNING ZORYN")
    print(LINE)

    runtime = Zoryn(
        observations
    )

    writer = KnowledgeWriter()

    repository = KnowledgeRepository(
        root=output,
        batch_size=2,
    )

    discoveries = 0

    print(LINE)
    print("WRITING KNOWLEDGE")
    print(LINE)

    for discovery in runtime.run(
        limit=2,
    ):

        bundle = writer.write(
            discovery
        )

        repository.add(
            bundle
        )

        discoveries += 1

    repository.flush()

    print(LINE)
    print("VALIDATING OUTPUT")
    print(LINE)

    tables = (
        "discoveries",
        "hypotheses",
        "patterns",
        "evidence",
        "hypothesis_patterns",
        "pattern_evidence",
    )

    for table in tables:

        directory = (
            output
            / table
        )

        assert directory.exists(), (
            f"Missing directory: {table}"
        )

        files = list(
            directory.glob(
                "*.parquet"
            )
        )

        assert files, (
            f"No parquet files found "
            f"for {table}"
        )

        print(
            f"{table:<24}"
            f"{len(files)} file(s)"
        )

    print(LINE)
    print("REPOSITORY VALIDATION")
    print(LINE)

    print(
        f"Discoveries : {discoveries}"
    )

    print(
        f"Output      : "
        f"{output.resolve()}"
    )

    print(LINE)
    print("VALIDATION PASSED")
    print(LINE)


if __name__ == "__main__":

    main()