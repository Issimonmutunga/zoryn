"""
Historical validation for Zoryn.
"""

from __future__ import annotations

from zoryn.knowledge.unit import KnowledgeUnit
from zoryn.knowledge.validation import KnowledgeValidator
from zoryn.knowledge.signature import Signature


class ValidationEngine:
    """
    Validates candidate knowledge against future observations.
    """

    def __init__(self) -> None:
        self.validator = KnowledgeValidator()

    def validate(
        self,
        knowledge: list[KnowledgeUnit],
        current: Signature,
        future: Signature,
    ) -> list[KnowledgeUnit]:
        """
        Baseline validation.

        If the relationship's target signature matches the
        future signature identifier, the knowledge is confirmed.
        Otherwise it is contradicted.
        """

        updated: list[KnowledgeUnit] = []

        future_state = "|".join(sorted(future.variables.keys()))

        for unit in knowledge:
            if unit.relationship.target_signature == future_state:
                updated.append(self.validator.confirm(unit))
            else:
                updated.append(self.validator.contradict(unit))

        return updated