"""
In-memory Event Store implementation.

Primarily intended for development, testing, and experimentation.
"""

from __future__ import annotations

from collections.abc import Iterable

from zoryn.core.event import Event

from .event_store import EventStore


class InMemoryEventStore(EventStore):
    """
    In-memory implementation of the Event Store.
    """

    def __init__(self) -> None:
        self._events: list[Event] = []

    def append(self, event: Event) -> None:
        """
        Append a single event.
        """
        self._events.append(event)

    def append_many(self, events: Iterable[Event]) -> None:
        """
        Append multiple events.
        """
        self._events.extend(events)

    def replay(self) -> Iterable[Event]:
        """
        Replay all events in insertion order.
        """
        yield from self._events

    def count(self) -> int:
        """
        Return the number of stored events.
        """
        return len(self._events)