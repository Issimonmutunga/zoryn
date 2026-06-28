"""
Entity Created projector.

Projects Entity Created events into the Living Earth Graph.
"""

from __future__ import annotations

from zoryn.core.entity import Entity
from zoryn.core.event import Event
from zoryn.core.event_types import EventType

from .event_projector import EventProjector
from .node import Node


class EntityCreatedProjector(EventProjector):
    """
    Projects Entity Created events.
    """

    def project(self, event: Event) -> None:
        """
        Project an entity creation event.
        """
        if event.event_type != EventType.ENTITY_CREATED:
            return

        entity = event.payload.get("entity")

        if not isinstance(entity, Entity):
            return

        node = Node(
            object_id=entity.id,
            object_type=entity.entity_type,
            properties=entity.metadata,
        )

        self._mutator.add_node(node)