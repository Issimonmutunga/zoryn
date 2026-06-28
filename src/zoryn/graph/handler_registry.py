"""
Handler registry.

Maintains the mapping between event types and their handlers.

The registry allows the graph engine to remain unaware of
concrete handler implementations.
"""

from __future__ import annotations

from zoryn.core.event import Event

from .event_handler import EventHandler


class HandlerRegistry:
    """
    Registry of event handlers.
    """

    def __init__(self) -> None:
        self._handlers: dict[str, EventHandler] = {}

    def register(self, event_type: str, handler: EventHandler) -> None:
        """
        Register a handler for an event type.
        """
        self._handlers[event_type] = handler

    def get(self, event: Event) -> EventHandler | None:
        """
        Return the handler for an event.

        Returns
        -------
        EventHandler | None
            Registered handler, if one exists.
        """
        return self._handlers.get(event.event_type)

    def contains(self, event_type: str) -> bool:
        """
        Determine whether a handler is registered.
        """
        return event_type in self._handlers
