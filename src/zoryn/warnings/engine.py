"""
Baseline warning engine for Zoryn.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable

from zoryn.events import Event


@dataclass(slots=True, frozen=True)
class Warning:
    """
    A warning produced by the warning engine.
    """

    event_id: str
    level: str
    message: str


Rule = Callable[[Event], Warning | None]


class WarningEngine:
    """
    Rule-based warning engine.
    """

    def __init__(self) -> None:
        self._rules: list[Rule] = []

    def add_rule(self, rule: Rule) -> None:
        """
        Register a warning rule.
        """
        self._rules.append(rule)

    def evaluate(self, event: Event) -> list[Warning]:
        """
        Evaluate an event against all registered rules.
        """
        warnings: list[Warning] = []

        for rule in self._rules:
            warning = rule(event)
            if warning is not None:
                warnings.append(warning)

        return warnings