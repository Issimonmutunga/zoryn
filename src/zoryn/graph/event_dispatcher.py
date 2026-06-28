"""
Event dispatcher for the Living Earth Graph.

Dispatches immutable events to registered handlers.

The dispatcher contains no graph logic.

It simply routes events.
"""

from __future__ import annotations

from collections.abc import Callable

from zoryn.core.event import Event


EventHandler = Callable[[Event], None]


class EventDispatcher:
    """
    Dispatch events to registered handlers.
    """

    def __init__(self) -> None:
        self._handlers: dict[str, EventHandler] = {}

    def register(self, event_type: str, handler: EventHandler) -> None:
        """
        Register a handler for an event type.
        """
        self._handlers[event_type] = handler

    def dispatch(self, event: Event) -> None:
        """
        Dispatch an event to its handler.

        Unknown event types are ignored.
        """
        handler = self._handlers.get(event.event_type)

        if handler is not None:
            handler(event)
