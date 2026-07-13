"""
Validate the persistence layer.

Checks that discoveries are correctly mapped into
knowledge persistence records.
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

    writer = KnowledgeWriter()

    discovery_count = 0
    hypothesis_count = 0
    pattern_count = 0
    evidence_count = 0
    hypothesis_pattern_count = 0
    pattern_evidence_count = 0

    print(LINE)
    print("VALIDATING PERSISTENCE")
    print(LINE)

    for discovery in runtime.run():

        bundle = writer.write(
            discovery
        )

        discovery_count += len(
            bundle.discoveries
        )

        hypothesis_count += len(
            bundle.hypotheses
        )

        pattern_count += len(
            bundle.patterns
        )

        evidence_count += len(
            bundle.evidence
        )

        hypothesis_pattern_count += len(
            bundle.hypothesis_patterns
        )

        pattern_evidence_count += len(
            bundle.pattern_evidence
        )

        #
        # Structural validation
        #

        assert len(
            bundle.discoveries
        ) == 1

        assert len(
            bundle.hypotheses
        ) == 1

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
        f"Discoveries         : {discovery_count:,}"
    )

    print(
        f"Hypotheses         : {hypothesis_count:,}"
    )

    print(
        f"Patterns           : {pattern_count:,}"
    )

    print(
        f"Evidence           : {evidence_count:,}"
    )

    print(
        f"Hypothesis Links   : "
        f"{hypothesis_pattern_count:,}"
    )

    print(
        f"Pattern Links      : "
        f"{pattern_evidence_count:,}"
    )

    print(LINE)
    print("VALIDATION PASSED")
    print(LINE)


if __name__ == "__main__":

    main()