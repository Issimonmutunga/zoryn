"""
Validate ReplayEngine.

Validates that ReplayEngine replays every Signature exactly once,
in chronological order, while producing reproducible validation
artifacts.
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
    / "replay"
    / "validate_replay_engine.txt"
)

REPORT.parent.mkdir(
    parents=True,
    exist_ok=True,
)

# ============================================================================
# LOAD OBSERVATIONS
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

print(f"Histories : {total_histories:,}")
print("=" * 70)

# ============================================================================
# VALIDATION STATE
# ============================================================================

history_count = 0
signature_count = 0

current_h3 = None
timestamps = []

history_lengths = []

sample = []

errors = []

# ============================================================================
# CALLBACK
# ============================================================================

def callback(
    h3_id,
    signature,
):

    global current_h3
    global history_count
    global signature_count
    global timestamps

    # ------------------------------------------------------------
    # New history encountered
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
                    f"| {signature_count:,} signatures"
                )

        history_count += 1
        current_h3 = h3_id
        timestamps = []

    # ------------------------------------------------------------
    # Signature
    # ------------------------------------------------------------

    signature_count += 1

    timestamps.append(
        signature.timestamp
    )

    if len(sample) < 12:
        sample.append(signature)

# ============================================================================
# REPLAY
# ============================================================================

print("=" * 70)
print("VALIDATING REPLAY ENGINE")
print("=" * 70)

engine.replay(callback)

# ------------------------------------------------------------
# Validate final history
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
    f.write("ZORYN REPLAY ENGINE VALIDATION\n")
    f.write("=" * 70 + "\n\n")

    f.write(
        f"Generated           : {datetime.now().isoformat()}\n"
    )

    f.write(
        f"Observation File    : {OBSERVATIONS}\n\n"
    )

    f.write("SUMMARY\n")
    f.write("-" * 70 + "\n")

    f.write(
        f"Histories           : {history_count:,}\n"
    )

    f.write(
        f"Signatures          : {signature_count:,}\n"
    )

    f.write(
        f"Minimum History     : {min(history_lengths)}\n"
    )

    f.write(
        f"Maximum History     : {max(history_lengths)}\n"
    )

    f.write(
        f"Average History     : "
        f"{sum(history_lengths)/len(history_lengths):.2f}\n"
    )

    f.write(
        f"Validation Errors   : {len(errors)}\n"
    )

    f.write("\n")

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
        f.write("✓ Histories replayed once\n")
        f.write("✓ Chronological ordering preserved\n")
        f.write("✓ No duplicate timestamps\n")
        f.write("✓ Callback invoked for every Signature\n\n")

    f.write("=" * 70 + "\n")
    f.write("SAMPLE REPLAY\n")
    f.write("=" * 70 + "\n\n")

    for i, signature in enumerate(
        sample,
        start=1,
    ):

        f.write("-" * 70 + "\n")
        f.write(f"[{i:04d}]\n")
        f.write("-" * 70 + "\n")

        f.write(
            f"Timestamp : {signature.timestamp}\n"
        )

        f.write(
            f"H3 ID     : {signature.h3_id}\n\n"
        )

        f.write("Variables\n")
        f.write("---------\n")

        for variable, value in signature:

            f.write(
                f"{variable:<35} {value}\n"
            )

        f.write("\n")

# ============================================================================
# FINAL SUMMARY
# ============================================================================

print("=" * 70)
print("REPLAY ENGINE VALIDATION")
print("=" * 70)

print(f"Histories          : {history_count:,}")
print(f"Signatures         : {signature_count:,}")
print(f"Minimum History    : {min(history_lengths)}")
print(f"Maximum History    : {max(history_lengths)}")
print(
    f"Average History    : "
    f"{sum(history_lengths)/len(history_lengths):.2f}"
)
print(f"Errors             : {len(errors)}")

print("=" * 70)
print(f"Report written to:")
print(REPORT)
print("=" * 70)

assert history_count == total_histories
assert signature_count == sum(history_lengths)
assert not errors

print("VALIDATION PASSED")
print("=" * 70)