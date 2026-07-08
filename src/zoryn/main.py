"""
Command-line entry point for Zoryn.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from .api import Zoryn


def parse_args() -> argparse.Namespace:
    """
    Parse command-line arguments.
    """

    parser = argparse.ArgumentParser(
        prog="zoryn",
        description=(
            "Run the Zoryn environmental "
            "reasoning engine."
        ),
    )

    parser.add_argument(
        "observations",
        type=Path,
        help=(
            "Path to the observations "
            "Parquet file."
        ),
    )

    return parser.parse_args()


def main() -> None:
    """
    Execute the reasoning pipeline.
    """

    args = parse_args()

    runtime = Zoryn(
        args.observations
    )

    discoveries = runtime.run()

    print("=" * 70)
    print("ZORYN REASONING COMPLETE")
    print("=" * 70)

    print(
        f"Discoveries : {len(discoveries):,}"
    )

    print("=" * 70)


if __name__ == "__main__":

    main()