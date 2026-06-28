"""
Projection registry.

Maintains the mapping between domain object types and their
corresponding graph projectors.

The registry allows new domain objects to be introduced without
modifying the graph engine.
"""

from __future__ import annotations

from .projector import Projector


class ProjectionRegistry:
    """
    Registry of graph projectors.
    """

    def __init__(self) -> None:
        self._projectors: dict[type, Projector] = {}

    def register(self, object_type: type, projector: Projector) -> None:
        """
        Register a projector for a domain object type.
        """
        self._projectors[object_type] = projector

    def get(self, obj: object) -> Projector | None:
        """
        Retrieve the projector for an object.

        Parameters
        ----------
        obj
            Domain object.

        Returns
        -------
        Projector | None
            Registered projector, if one exists.
        """
        return self._projectors.get(type(obj))

    def contains(self, object_type: type) -> bool:
        """
        Determine whether a projector is registered.
        """
        return object_type in self._projectors

    def clear(self) -> None:
        """
        Remove all registered projectors.
        """
        self._projectors.clear()