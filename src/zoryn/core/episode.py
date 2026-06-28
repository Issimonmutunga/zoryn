"""
Canonical episode definition.

Episodes represent significant sequences of graph evolution.

They capture reusable experiences that become part of Zoryn's
long-term memory.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID

from .identifiers import new_id


@dataclass(frozen=True, slots=True)
class Episode:
    """
    Immutable episode.

    Parameters
    ----------
    episode_type
        Logical type of the episode.
    start_time
        Beginning of the episode.
    end_time
        End of the episode.
    entity_ids
        Entities participating in the episode.
    description
        Optional human-readable description.
    """

    episode_type: str

    start_time: datetime
    end_time: datetime

    entity_ids: tuple[UUID, ...]

    description: str = ""

    id: UUID = field(default_factory=new_id)