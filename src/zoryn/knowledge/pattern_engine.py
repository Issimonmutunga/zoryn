"""
Pattern discovery engine.

Coordinates PatternRules to discover recurring environmental
patterns from evidence.
"""

from __future__ import annotations

from collections.abc import Iterable

from .evidence import Evidence
from .pattern import Pattern
from .pattern_rule import PatternRule


class PatternEngine:
    """
    Executes one or more PatternRules.
    """

    def __init__(
        self,
        rules: Iterable[PatternRule],
    ) -> None:

        self._rules = tuple(rules)

    @property
    def rules(
        self,
    ) -> tuple[PatternRule, ...]:
        """
        Registered pattern rules.
        """

        return self._rules

    def discover(
        self,
        evidence: Iterable[Evidence],
    ) -> list[Pattern]:
        """
        Execute every rule.
        """

        patterns: list[Pattern] = []

        for rule in self._rules:

            patterns.extend(
                rule.discover(evidence)
            )

        return patterns