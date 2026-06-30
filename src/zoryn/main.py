"""
Zoryn pilot entry point.
"""

from __future__ import annotations

from pathlib import Path

from zoryn.ingestion.loader import load_observations
from zoryn.replay import ReplayEngine


def run(observation_file: str | Path):
    """
    Execute a historical replay.
    """

    observations = load_observations(observation_file)

    engine = ReplayEngine()

    knowledge = engine.run(observations)

    return knowledge


if __name__ == "__main__":
    raise SystemExit(
        "Import run() or integrate with the CLI when available."
    )