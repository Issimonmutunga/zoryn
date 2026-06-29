"""
Application manifest for Zoryn.
"""

from __future__ import annotations

from dataclasses import dataclass

from .version import __version__


@dataclass(frozen=True, slots=True)
class Manifest:
    """
    Immutable application metadata.
    """

    name: str = "Zoryn"
    version: str = __version__
    description: str = (
        "A continually learning Early Warning System for Earth systems."
    )
    license: str = "MIT"


MANIFEST = Manifest()