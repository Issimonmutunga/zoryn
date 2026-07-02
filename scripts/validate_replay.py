"""
Validate SignatureBuilder by building and inspecting one H3 history.

Creates a human-readable validation report.

Output
------
data/
    validation/
        replay/
            validate_replay.txt
"""

from __future__ import annotations

import sys
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
# OUTPUTS
# ============================================================================

VALIDATION = PROJECT_ROOT / "data" / "validation"

REPLAY = VALIDATION / "replay"
COMPARATOR = VALIDATION / "comparator"
EVIDENCE = VALIDATION / "evidence"
DISCOVERER = VALIDATION / "discoverer"
WARNINGS = VALIDATION / "warnings"

for folder in (
    REPLAY,
    COMPARATOR,
    EVIDENCE,
    DISCOVERER,
    WARNINGS,
):
    folder.mkdir(
        parents=True,
        exist_ok=True,
    )

REPORT = REPLAY / "validate_replay.txt"

# ============================================================================
# LOAD OBSERVATIONS
# ============================================================================

observations = pl.scan_parquet(OBSERVATIONS)

store = ObservationStore(
    observations,
)

builder = SignatureBuilder(
    store,
)

# ============================================================================
# SELECT FIRST HISTORY
# ============================================================================

histories = store.histories()

h3_id, history = next(histories)

timestamps = (
    history["timestamp"]
    .unique(maintain_order=True)
    .to_list()
)

# ============================================================================
# BUILD SIGNATURES
# ============================================================================

signatures = [
    builder.build(
        timestamp=timestamp,
        h3_id=h3_id,
    )
    for timestamp in timestamps
]

# ============================================================================
# CONSOLE
# ============================================================================

print("=" * 70)
print("ZORYN REPLAY VALIDATION")
print("=" * 70)
print(f"H3              : {h3_id}")
print(f"Signatures      : {len(signatures)}")
print(f"Variables        : {len(signatures[0])}")
print(f"First Timestamp : {signatures[0].timestamp}")
print(f"Last Timestamp  : {signatures[-1].timestamp}")
print("=" * 70)

# ============================================================================
# REPORT
# ============================================================================

with REPORT.open(
    "w",
    encoding="utf-8",
) as f:

    f.write("=" * 70 + "\n")
    f.write("ZORYN REPLAY VALIDATION\n")
    f.write("=" * 70 + "\n\n")

    f.write(
        f"Generated : {datetime.now().isoformat()}\n"
    )

    f.write(
        f"Observation File : {OBSERVATIONS}\n\n"
    )

    f.write("SUMMARY\n")
    f.write("-" * 70 + "\n")

    f.write(f"H3 ID            : {h3_id}\n")
    f.write(f"Signatures       : {len(signatures)}\n")
    f.write(f"Variables        : {len(signatures[0])}\n")
    f.write(
        f"First Timestamp  : {signatures[0].timestamp}\n"
    )
    f.write(
        f"Last Timestamp   : {signatures[-1].timestamp}\n"
    )

    f.write("\n")
    f.write("=" * 70 + "\n")
    f.write("SIGNATURES\n")
    f.write("=" * 70 + "\n\n")

    for i, signature in enumerate(
        signatures,
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

print(f"Report written to:\n{REPORT}")
print("=" * 70)
print("VALIDATION COMPLETE")
print("=" * 70)