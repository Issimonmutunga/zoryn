"""
Abstract Event Store.

The Event Store is the system of record for Zoryn.

Concrete implementations (memory, DuckDB, PostgreSQL, etc.)
must implement this interface.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Iterable

from zoryn.core.event import Event


class EventStore(ABC):
    """
    Abstract Event Store.

    Every implementation must support appending events
    and replaying the complete event history.
    """

    @abstractmethod
    def append(self, event: Event) -> None:
        """
        Append a single event.
        """
        raise NotImplementedError

    @abstractmethod
    def append_many(self, events: Iterable[Event]) -> None:
        """
        Append multiple events.
        """
        raise NotImplementedError

    @abstractmethod
    def replay(self) -> Iterable[Event]:
        """
        Replay the complete event history
        in chronological order.
        """
        raise NotImplementedError

    @abstractmethod
    def count(self) -> int:
        """
        Return the total number of stored events.
        """
        raise NotImplementedError
