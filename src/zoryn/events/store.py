"""
Lightweight event store for Zoryn.
"""

from __future__ import annotations

from collections.abc import Iterable
from typing import Iterator

from .event import Event


class EventStore:
    """
    In-memory event store.

    Persistence will be introduced only when required.
    """

    def __init__(self) -> None:
        self._events: dict[str, Event] = {}

    def add(self, event: Event) -> None:
        """
        Add or replace an event.
        """
        self._events[event.id] = event

    def get(self, event_id: str) -> Event | None:
        """
        Retrieve an event by ID.
        """
        return self._events.get(event_id)

    def remove(self, event_id: str) -> None:
        """
        Remove an event if it exists.
        """
        self._events.pop(event_id, None)

    def clear(self) -> None:
        """
        Remove all events.
        """
        self._events.clear()

    def count(self) -> int:
        """
        Return the number of stored events.
        """
        return len(self._events)

    def all(self) -> list[Event]:
        """
        Return all events.
        """
        return list(self._events.values())

    def extend(self, events: Iterable[Event]) -> None:
        """
        Add multiple events.
        """
        for event in events:
            self.add(event)

    def __iter__(self) -> Iterator[Event]:
        return iter(self._events.values())

    def __len__(self) -> int:
        return len(self._events)