"""
Configuration utilities for Zoryn.
"""

from __future__ import annotations

from pathlib import Path

import yaml


class Config(dict):
    """
    Dictionary-backed configuration.
    """


def load_config(path: str | Path) -> Config:
    """
    Load a YAML configuration file.
    """
    path = Path(path)

    if not path.exists():
        raise FileNotFoundError(path)

    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}

    return Config(data)