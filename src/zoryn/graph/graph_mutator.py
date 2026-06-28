"""
Graph mutation operations.

GraphMutator is the only component permitted to modify the
Living Earth Graph.

All graph updates should pass through this class.
"""

from __future__ import annotations

from uuid import UUID

from zoryn.core.entity import Entity
from zoryn.core.relationship import Relationship


class GraphMutator:
    """
    Encapsulates graph mutation operations.
    """

    def __init__(
        self,
        entities: dict[UUID, Entity],
        relationships: dict[UUID, Relationship],
    ) -> None:
        self._entities = entities
        self._relationships = relationships

    def add_entity(self, entity: Entity) -> None:
        """
        Add or replace an entity.
        """
        self._entities[entity.id] = entity

    def add_relationship(self, relationship: Relationship) -> None:
        """
        Add or replace a relationship.
        """
        self._relationships[relationship.id] = relationship

    def has_entity(self, entity_id: UUID) -> bool:
        """
        Check whether an entity exists.
        """
        return entity_id in self._entities

    def has_relationship(self, relationship_id: UUID) -> bool:
        """
        Check whether a relationship exists.
        """
        return relationship_id in self._relationships

    def entity(self, entity_id: UUID) -> Entity | None:
        """
        Return an entity if present.
        """
        return self._entities.get(entity_id)

    def relationship(self, relationship_id: UUID) -> Relationship | None:
        """
        Return a relationship if present.
        """
        return self._relationships.get(relationship_id)