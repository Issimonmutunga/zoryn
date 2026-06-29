from pathlib import Path

import pandas as pd

from zoryn.ingestion import load_observations


def test_load_valid_csv(tmp_path: Path) -> None:
    df = pd.DataFrame(
        {
            "timestamp": pd.to_datetime(["2026-01-01"]),
            "latitude": [0.0],
            "longitude": [36.0],
            "variable": pd.Series(["rainfall"], dtype="string"),
            "value": [12.5],
            "source": pd.Series(["chirps"], dtype="string"),
            "quality": pd.Series(["good"], dtype="string"),
        }
    )

    path = tmp_path / "observations.csv"
    df.to_csv(path, index=False)

    loaded = load_observations(path)

    assert len(loaded) == 1
    assert list(loaded.columns) == list(df.columns)