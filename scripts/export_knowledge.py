"""
Export the complete Zoryn knowledge graph.

Observation
    ↓
KnowledgeEngine
    ↓
Discovery
    ↓
KnowledgeWriter
    ↓
KnowledgeBundle
    ↓
KnowledgeRepository
"""

from __future__ import annotations

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
        "data/processed/knowledge"
    )

    print(LINE)
    print("RUNNING ZORYN")
    print(LINE)

    runtime = Zoryn(
        observations
    )

    writer = KnowledgeWriter()

    repository = KnowledgeRepository(
        output
    )

    discoveries = 0

    print(LINE)
    print("EXPORTING KNOWLEDGE")
    print(LINE)

    for discovery in runtime.run():

        bundle = writer.write(
            discovery
        )

        repository.save(
            bundle
        )

        discoveries += 1

        if discoveries % 1000 == 0:

            print(
                f"{discoveries:,} discoveries exported..."
            )

    print(LINE)
    print("EXPORT COMPLETE")
    print(LINE)

    print(
        f"Discoveries : {discoveries:,}"
    )

    print(
        f"Output : {output.resolve()}"
    )

    print(LINE)


if __name__ == "__main__":

    main()