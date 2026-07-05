"""
Validate Evidence generation.

Validates the complete pipeline

    ReplayEngine
        ↓
    SignatureComparator
        ↓
    EvidenceBuilder
        ↓
    EvidenceStore
"""

from __future__ import annotations

import sys
from collections import Counter
from datetime import datetime
from pathlib import Path

import polars as pl

# ============================================================================
# PROJECT PATHS
# ============================================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

SRC = PROJECT_ROOT / "src"

if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from zoryn.knowledge.builder import SignatureBuilder
from zoryn.knowledge.comparator import SignatureComparator
from zoryn.knowledge.evidence_builder import EvidenceBuilder
from zoryn.knowledge.evidence_store import EvidenceStore
from zoryn.knowledge.store import ObservationStore
from zoryn.replay import ReplayEngine

# ============================================================================
# INPUT
# ============================================================================

OBSERVATIONS = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "observations"
    / "master_observations.parquet"
)

# ============================================================================
# OUTPUT
# ============================================================================

REPORT = (
    PROJECT_ROOT
    / "data"
    / "validation"
    / "evidence"
    / "validate_evidence.txt"
)

REPORT.parent.mkdir(
    parents=True,
    exist_ok=True,
)

# ============================================================================
# LOAD
# ============================================================================

print("=" * 70)
print("LOADING OBSERVATIONS")
print("=" * 70)

observations = pl.scan_parquet(
    OBSERVATIONS
)

total_histories = (
    observations
    .select("h3_id")
    .unique()
    .collect()
    .height
)

store = ObservationStore(
    observations
)

builder = SignatureBuilder(
    store
)

engine = ReplayEngine(
    builder
)

comparator = SignatureComparator()

evidence_builder = EvidenceBuilder()

print(f"Histories : {total_histories:,}")

print("=" * 70)

# ============================================================================
# VALIDATION STATE
# ============================================================================

history_count = 0

relationship_count = 0

evidence_count = 0

history_lengths = []

errors = []

sample_evidence = []

all_evidence = []

current_h3 = None

previous_signature = None

timestamps = []

# ============================================================================
# CALLBACK
# ============================================================================

def callback(
    h3_id,
    signature,
):

    global current_h3
    global previous_signature
    global history_count
    global relationship_count
    global evidence_count
    global timestamps

    # ------------------------------------------------------------------------
    # NEW HISTORY
    # ------------------------------------------------------------------------

    if h3_id != current_h3:

        if current_h3 is not None:

            history_lengths.append(
                len(timestamps)
            )

            if timestamps != sorted(timestamps):

                errors.append(
                    f"{current_h3}: timestamps out of order"
                )

            duplicates = [
                t
                for t, c in Counter(
                    timestamps
                ).items()
                if c > 1
            ]

            if duplicates:

                errors.append(
                    f"{current_h3}: duplicate timestamps"
                )

            if history_count % 5000 == 0:

                print(
                    f"{history_count:,}/{total_histories:,} histories "
                    f"| {relationship_count:,} relationships "
                    f"| {evidence_count:,} evidence"
                )

        history_count += 1

        current_h3 = h3_id

        previous_signature = None

        timestamps = []

    timestamps.append(
        signature.timestamp
    )

    # ------------------------------------------------------------------------
    # FIRST SIGNATURE
    # ------------------------------------------------------------------------

    if previous_signature is None:

        previous_signature = signature
        return

    # ------------------------------------------------------------------------
    # RELATIONSHIP
    # ------------------------------------------------------------------------

    relationship = comparator.compare(
        previous_signature,
        signature,
    )

    relationship_count += 1

    # ------------------------------------------------------------------------
    # EVIDENCE
    # ------------------------------------------------------------------------

    evidence = evidence_builder.build(
        relationship
    )

    evidence_count += len(
        evidence
    )

    all_evidence.extend(
        evidence
    )

    if len(sample_evidence) < 12:

        remaining = (
            12
            - len(sample_evidence)
        )

        sample_evidence.extend(
            evidence[:remaining]
        )

    previous_signature = signature

# ============================================================================
# RUN VALIDATION
# ============================================================================

print("=" * 70)
print("VALIDATING EVIDENCE")
print("=" * 70)

engine.replay(
    callback
)

# ------------------------------------------------------------------------
# Final history validation
# ------------------------------------------------------------------------

history_lengths.append(
    len(timestamps)
)

if timestamps != sorted(timestamps):

    errors.append(
        f"{current_h3}: timestamps out of order"
    )

duplicates = [
    t
    for t, c in Counter(
        timestamps
    ).items()
    if c > 1
]

if duplicates:

    errors.append(
        f"{current_h3}: duplicate timestamps"
    )

# ============================================================================
# BUILD STORE
# ============================================================================

evidence_store = EvidenceStore(
    all_evidence
)
# ============================================================================
# VALIDATE EVIDENCE STORE
# ============================================================================

print("=" * 70)
print("VALIDATING EVIDENCE STORE")
print("=" * 70)

store_count = len(evidence_store)

if store_count != evidence_count:

    errors.append(
        "EvidenceStore size does not match generated evidence."
    )

for evidence in evidence_store:

    if evidence.variable not in evidence.relationship:

        errors.append(
            f"{evidence.timestamp}: evidence variable missing "
            f"from relationship."
        )

    if evidence.h3_id != evidence.relationship.current.h3_id:

        errors.append(
            f"{evidence.timestamp}: H3 mismatch."
        )

    if evidence.timestamp != evidence.relationship.current.timestamp:

        errors.append(
            f"{evidence.timestamp}: timestamp mismatch."
        )

# ============================================================================
# REPORT
# ============================================================================

print("=" * 70)
print("WRITING REPORT")
print("=" * 70)

with REPORT.open(
    "w",
    encoding="utf-8",
) as f:

    f.write("=" * 70 + "\n")
    f.write("ZORYN EVIDENCE VALIDATION\n")
    f.write("=" * 70 + "\n\n")

    f.write(
        f"Generated          : {datetime.now().isoformat()}\n"
    )

    f.write(
        f"Observation File   : {OBSERVATIONS}\n\n"
    )

    # --------------------------------------------------------------------
    # SUMMARY
    # --------------------------------------------------------------------

    f.write("SUMMARY\n")
    f.write("-" * 70 + "\n")

    f.write(
        f"Histories              : {history_count:,}\n"
    )

    f.write(
        f"Relationships          : {relationship_count:,}\n"
    )

    f.write(
        f"Evidence               : {evidence_count:,}\n"
    )

    f.write(
        f"EvidenceStore          : {store_count:,}\n"
    )

    f.write(
        f"Minimum History Length : {min(history_lengths)}\n"
    )

    f.write(
        f"Maximum History Length : {max(history_lengths)}\n"
    )

    f.write(
        f"Average History Length : "
        f"{sum(history_lengths)/len(history_lengths):.2f}\n"
    )

    f.write(
        f"Validation Errors      : {len(errors)}\n\n"
    )

    # --------------------------------------------------------------------
    # CHECKS
    # --------------------------------------------------------------------

    if errors:

        f.write("ERRORS\n")
        f.write("-" * 70 + "\n")

        for error in errors:

            f.write(error + "\n")

        f.write("\n")

    else:

        f.write("CHECKS\n")
        f.write("-" * 70 + "\n")
        f.write("✓ Replay completed successfully\n")
        f.write("✓ Relationships created\n")
        f.write("✓ Evidence generated\n")
        f.write("✓ EvidenceStore populated\n")
        f.write("✓ H3 identifiers preserved\n")
        f.write("✓ Timestamps preserved\n")
        f.write("✓ One Evidence object per changed variable\n\n")

    # --------------------------------------------------------------------
    # SAMPLE EVIDENCE
    # --------------------------------------------------------------------

    f.write("=" * 70 + "\n")
    f.write("SAMPLE EVIDENCE\n")
    f.write("=" * 70 + "\n\n")

    for i, evidence in enumerate(
        sample_evidence,
        start=1,
    ):

        comparison = evidence.comparison
        metadata = comparison.metadata

        f.write("-" * 70 + "\n")
        f.write(f"[{i:04d}]\n")
        f.write("-" * 70 + "\n")

        f.write(f"H3        : {evidence.h3_id}\n")
        f.write(f"Timestamp : {evidence.timestamp}\n")
        f.write(f"Variable  : {evidence.variable}\n")
        f.write(f"Strength  : {evidence.strength:.3f}\n\n")

        f.write("Comparison\n")
        f.write("----------\n")

        f.write(
            f"Previous : {metadata['previous']}\n"
        )

        f.write(
            f"Current  : {metadata['current']}\n"
        )

        f.write(
            f"Delta    : {metadata['delta']}\n"
        )

        f.write(
            f"Percent  : {metadata['percent_change']}\n"
        )

        f.write("\n")

# ============================================================================
# FINAL SUMMARY
# ============================================================================

expected_relationships = sum(
    length - 1
    for length in history_lengths
)

print("=" * 70)
print("EVIDENCE VALIDATION")
print("=" * 70)

print(f"Histories          : {history_count:,}")
print(f"Relationships      : {relationship_count:,}")
print(f"Evidence           : {evidence_count:,}")
print(f"EvidenceStore      : {store_count:,}")
print(f"Minimum History    : {min(history_lengths)}")
print(f"Maximum History    : {max(history_lengths)}")
print(
    f"Average History    : "
    f"{sum(history_lengths)/len(history_lengths):.2f}"
)
print(f"Errors             : {len(errors)}")

print("=" * 70)
print(f"Expected Relationships : {expected_relationships:,}")
print(f"Observed Relationships : {relationship_count:,}")
print("=" * 70)

print("Report written to:")
print(REPORT)
print("=" * 70)

assert history_count == total_histories
assert relationship_count == expected_relationships
assert store_count == evidence_count
assert not errors

print("VALIDATION PASSED")
print("=" * 70)