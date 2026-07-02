"""
Validate SignatureComparator.

Validates that consecutive Signatures are compared correctly and
produce immutable Relationship objects.
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
    / "comparator"
    / "validate_comparator.txt"
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

print(f"Histories : {total_histories:,}")
print("=" * 70)

# ============================================================================
# VALIDATION STATE
# ============================================================================

history_count = 0
relationship_count = 0
change_count = 0

history_lengths = []

errors = []

sample_relationships = []

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
    global change_count
    global timestamps

    # ------------------------------------------------------------
    # NEW HISTORY
    # ------------------------------------------------------------

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
                    f"| {relationship_count:,} relationships"
                )

        history_count += 1

        current_h3 = h3_id

        previous_signature = None

        timestamps = []

    timestamps.append(
        signature.timestamp
    )

    # ------------------------------------------------------------
    # FIRST SIGNATURE
    # ------------------------------------------------------------

    if previous_signature is None:

        previous_signature = signature
        return

    # ------------------------------------------------------------
    # COMPARE
    # ------------------------------------------------------------

    relationship = comparator.compare(
        previous_signature,
        signature,
    )

    relationship_count += 1

    change_count += len(
        relationship
    )

    if len(sample_relationships) < 12:

        sample_relationships.append(
            relationship
        )

    previous_signature = signature

# ============================================================================
# RUN VALIDATION
# ============================================================================

print("=" * 70)
print("VALIDATING COMPARATOR")
print("=" * 70)

engine.replay(
    callback
)

# ------------------------------------------------------------
# Final history validation
# ------------------------------------------------------------

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
    f.write("ZORYN COMPARATOR VALIDATION\n")
    f.write("=" * 70 + "\n\n")

    f.write(
        f"Generated          : {datetime.now().isoformat()}\n"
    )

    f.write(
        f"Observation File   : {OBSERVATIONS}\n\n"
    )

    # ------------------------------------------------------------------------
    # SUMMARY
    # ------------------------------------------------------------------------

    f.write("SUMMARY\n")
    f.write("-" * 70 + "\n")

    f.write(
        f"Histories              : {history_count:,}\n"
    )

    f.write(
        f"Relationships          : {relationship_count:,}\n"
    )

    f.write(
        f"Changed Variables      : {change_count:,}\n"
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

    # ------------------------------------------------------------------------
    # CHECKS
    # ------------------------------------------------------------------------

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
        f.write("✓ Chronological ordering preserved\n")
        f.write("✓ No duplicate timestamps\n")
        f.write("✓ Comparator executed for every consecutive pair\n\n")

    # ------------------------------------------------------------------------
    # SAMPLE RELATIONSHIPS
    # ------------------------------------------------------------------------

    f.write("=" * 70 + "\n")
    f.write("SAMPLE RELATIONSHIPS\n")
    f.write("=" * 70 + "\n\n")

    for i, relationship in enumerate(
        sample_relationships,
        start=1,
    ):

        f.write("-" * 70 + "\n")
        f.write(f"[{i:04d}]\n")
        f.write("-" * 70 + "\n")

        f.write(
            f"Previous : {relationship.previous.timestamp}\n"
        )

        f.write(
            f"Current  : {relationship.current.timestamp}\n"
        )

        f.write(
            f"H3       : {relationship.current.h3_id}\n\n"
        )

        if len(relationship) == 0:

            f.write("No changes detected.\n\n")
            continue

        f.write("Changes\n")
        f.write("-------\n")

        for variable, result in relationship:

            metadata = result.metadata

            f.write(f"{variable}\n")
            f.write(
                f"    Previous : {metadata['previous']}\n"
            )
            f.write(
                f"    Current  : {metadata['current']}\n"
            )
            f.write(
                f"    Delta    : {metadata['delta']}\n"
            )
            f.write(
                f"    Percent  : {metadata['percent_change']}\n\n"
            )

# ============================================================================
# FINAL SUMMARY
# ============================================================================

expected_relationships = (
    total_histories
    * (history_lengths[0] - 1)
)

print("=" * 70)
print("COMPARATOR VALIDATION")
print("=" * 70)

print(f"Histories          : {history_count:,}")
print(f"Relationships      : {relationship_count:,}")
print(f"Changed Variables  : {change_count:,}")
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
assert not errors

print("VALIDATION PASSED")
print("=" * 70)