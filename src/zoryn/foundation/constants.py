"""
Canonical constants for Zoryn.

Only architecture-level constants belong here.

Project-specific configuration values belong in the configuration
system, not in this module.
"""

from __future__ import annotations

from datetime import UTC

# ---------------------------------------------------------------------
# Time
# ---------------------------------------------------------------------

DEFAULT_TIMEZONE = UTC

# ---------------------------------------------------------------------
# Confidence
# ---------------------------------------------------------------------

MIN_CONFIDENCE = 0.0
MAX_CONFIDENCE = 1.0
DEFAULT_CONFIDENCE = 1.0

# ---------------------------------------------------------------------
# Metadata
# ---------------------------------------------------------------------

EMPTY_METADATA: dict[str, object] = {}

# ---------------------------------------------------------------------
# Version
# ---------------------------------------------------------------------

CORE_API_VERSION = "1.0"