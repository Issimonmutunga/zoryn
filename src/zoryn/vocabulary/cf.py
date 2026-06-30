"""
CF vocabulary definitions for Zoryn.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(slots=True, frozen=True)
class CFVariable:
    """
    Canonical Earth-system variable.

    Variables should follow the CF Standard Name Convention
    wherever possible. Dataset-specific names are mapped to
    these canonical variables during ingestion.
    """

    name: str
    cf_name: str
    units: str
    description: str
    category: str

    aliases: tuple[str, ...] = field(default_factory=tuple)