"""
Projection engine.

Coordinates event projection into the Living Earth Graph.

The engine routes immutable events to the appropriate projector.
"""

from __future__ import annotations

from zoryn.core.event import Event

from .event_projector import EventProjector


class ProjectionEngine:
    """
    Routes events to registered projectors.
    """

    def __init__(self) -> None:
        self._projectors: dict[str, EventProjector] = {}

    def register(
        self,
        event_type: str,
        projector: EventProjector,
    ) -> None:
        """
        Register a projector.
        """
        self._projectors[event_type] = projector

    def project(self, event: Event) -> None:
        """
        Project an event into the graph.
        """
        projector = self._projectors.get(event.event_type)

        if projector is not None:
            projector.project(event)

    def contains(self, event_type: str) -> bool:
        """
        Determine whether a projector exists.
        """
        return event_type in self._projectors

    def clear(self) -> None:
        """
        Remove all registered projectors.
        """
        self._projectors.clear()