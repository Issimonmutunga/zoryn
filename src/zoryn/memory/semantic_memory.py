"""
Semantic memory.

Semantic memory stores validated knowledge accumulated through
graph evolution.

Unlike episodic memory, semantic memory is not tied to a single
event or episode.

It represents stable understanding of the Earth system.
"""

from __future__ import annotations

from typing import Any


class SemanticMemory:
    """
    Long-term semantic memory.
    """

    def __init__(self) -> None:
        self._knowledge: dict[str, Any] = {}

    def remember(
        self,
        key: str,
        knowledge: Any,
    ) -> None:
        """
        Store validated knowledge.
        """
        self._knowledge[key] = knowledge

    def recall(
        self,
        key: str,
    ) -> Any | None:
        """
        Retrieve knowledge.
        """
        return self._knowledge.get(key)

    def contains(
        self,
        key: str,
    ) -> bool:
        """
        Determine whether knowledge exists.
        """
        return key in self._knowledge

    def knowledge(self) -> dict[str, Any]:
        """
        Return a shallow copy of all knowledge.
        """
        return self._knowledge.copy()

    def clear(self) -> None:
        """
        Remove all stored knowledge.
        """
        self._knowledge.clear()

    def __len__(self) -> int:
        return len(self._knowledge)