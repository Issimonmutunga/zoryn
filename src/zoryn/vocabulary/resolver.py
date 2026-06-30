"""
Variable resolver for Zoryn.
"""

from __future__ import annotations

from .registry import REGISTRY


_ALIAS_MAP: dict[str, str] = {}

for variable in REGISTRY.values():
    _ALIAS_MAP[variable.name.lower()] = variable.name
    _ALIAS_MAP[variable.cf_name.lower()] = variable.name

    for alias in variable.aliases:
        _ALIAS_MAP[alias.lower()] = variable.name


def resolve(name: str) -> str:
    """
    Resolve a dataset-specific variable name to the
    canonical Zoryn variable name.
    """
    key = name.strip().lower()

    try:
        return _ALIAS_MAP[key]
    except KeyError as exc:
        raise KeyError(f"Unknown variable '{name}'.") from exc