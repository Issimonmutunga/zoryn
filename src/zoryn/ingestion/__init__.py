"""
Observation ingestion for Zoryn.

This package provides the public interface for loading and validating
observation datasets.
"""

from .loader import load_observations

__all__ = [
    "load_observations",
]