"""
Abstract graph projector.

Projectors transform immutable domain objects into graph
representations.

This keeps the Living Earth Graph independent of domain models.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from .edge import Edge
from .node import Node


class Projector(ABC):
    """
    Base class for graph projectors.
    """

    @abstractmethod
    def project_node(self, obj: object) -> Node | None:
        """
        Project a domain object into a graph node.

        Returns
        -------
        Node | None
            Graph node representation, if applicable.
        """
        raise NotImplementedError

    @abstractmethod
    def project_edges(self, obj: object) -> tuple[Edge, ...]:
        """
        Project a domain object into graph edges.

        Returns
        -------
        tuple[Edge, ...]
            Zero or more graph edges.
        """
        raise NotImplementedError