"""
Knowledge unit for Zoryn.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from uuid import uuid4


class KnowledgeStatus(str, Enum):
    """
    Lifecycle state of a knowledge unit.
    """

    CANDIDATE = "candidate"
    VALIDATED = "validated"
    WEAKENING = "weakening"
    RETIRED = "retired"


@dataclass(slots=True, frozen=True)
class KnowledgeUnit:
    """
    A single validated relationship discovered from observations.
    """

    relationship: str

    confidence: float = 0.0

    evidence_count: int = 0

    status: KnowledgeStatus = KnowledgeStatus.CANDIDATE

    created_at: datetime = field(default_factory=datetime.utcnow)

    id: str = field(default_factory=lambda: str(uuid4()))