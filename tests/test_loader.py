from pathlib import Path

import pandas as pd

from zoryn.ingestion import load_observations


def test_load_valid_csv(tmp_path: Path) -> None:

    df = pd.DataFrame(
        {
            "timestamp": ["2026-01-01"],
            "h3_id": ["8a2a1072d4dffff"],
            "variable": ["precipitation_amount"],
            "value": [12.5],
            "source": ["CHIRPS"],
        }
    )

    path = tmp_path / "observations.csv"

    df.to_csv(path, index=False)

    loaded = load_observations(path)

    assert len(loaded) == 1

    observation = loaded[0]

    assert observation.timestamp == "2026-01-01"
    assert observation.h3_id == "8a2a1072d4dffff"
    assert observation.variable == "precipitation_amount"
    assert observation.value == 12.5
    assert observation.source == "CHIRPS"