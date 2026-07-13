"""
Validate the persistence mapping layer.

Validates that a single Discovery is correctly mapped into
a KnowledgeBundle.
"""

from __future__ import annotations

from pathlib import Path

from zoryn.api import Zoryn
from zoryn.persistence.writer import KnowledgeWriter


LINE = "=" * 70


def main() -> None:

    observations = Path(
        "data/processed/observations/"
        "master_observations.parquet"
    )

    print(LINE)
    print("RUNNING ZORYN")
    print(LINE)

    runtime = Zoryn(
        observations
    )

    print(LINE)
    print("FETCHING FIRST DISCOVERY")
    print(LINE)

    try:
        discovery = next(
            runtime.run(
                limit=1,
            )
        )

    except StopIteration:

        raise RuntimeError(
            "No discoveries were produced."
        )

    writer = KnowledgeWriter()

    print(LINE)
    print("MAPPING DISCOVERY")
    print(LINE)

    bundle = writer.write(
        discovery
    )

    #
    # Counts
    #

    assert len(
        bundle.discoveries
    ) == 1

    assert len(
        bundle.hypotheses
    ) == 1

    assert len(
        bundle.patterns
    ) > 0

    assert len(
        bundle.evidence
    ) > 0

    #
    # Foreign keys
    #

    hypothesis_ids = {
        h.id
        for h in bundle.hypotheses
    }

    pattern_ids = {
        p.id
        for p in bundle.patterns
    }

    evidence_ids = {
        e.id
        for e in bundle.evidence
    }

    discovery = bundle.discoveries[0]

    assert (
        discovery.hypothesis_id
        in hypothesis_ids
    )

    for relation in bundle.hypothesis_patterns:

        assert (
            relation.hypothesis_id
            in hypothesis_ids
        )

        assert (
            relation.pattern_id
            in pattern_ids
        )

    for relation in bundle.pattern_evidence:

        assert (
            relation.pattern_id
            in pattern_ids
        )

        assert (
            relation.evidence_id
            in evidence_ids
        )

    print(LINE)
    print("PERSISTENCE VALIDATION")
    print(LINE)

    print(
        f"Discoveries         : "
        f"{len(bundle.discoveries)}"
    )

    print(
        f"Hypotheses         : "
        f"{len(bundle.hypotheses)}"
    )

    print(
        f"Patterns           : "
        f"{len(bundle.patterns)}"
    )

    print(
        f"Evidence           : "
        f"{len(bundle.evidence)}"
    )

    print(
        f"Hypothesis Links   : "
        f"{len(bundle.hypothesis_patterns)}"
    )

    print(
        f"Pattern Links      : "
        f"{len(bundle.pattern_evidence)}"
    )

    print(LINE)
    print("VALIDATION PASSED")
    print(LINE)


if __name__ == "__main__":

    main()