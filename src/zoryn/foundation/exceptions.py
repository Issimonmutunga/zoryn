"""
Canonical exceptions for Zoryn.

All custom exceptions derive from ZorynError.
"""


class ZorynError(Exception):
    """Base exception for all Zoryn errors."""


class ValidationError(ZorynError):
    """Raised when validation fails."""


class EntityNotFoundError(ZorynError):
    """Raised when an entity cannot be found."""


class ObservationError(ZorynError):
    """Raised when an observation is invalid."""


class StateError(ZorynError):
    """Raised when a state operation fails."""


class RelationshipError(ZorynError):
    """Raised when a relationship operation fails."""


class EventError(ZorynError):
    """Raised when an event operation fails."""


class EpisodeError(ZorynError):
    """Raised when an episode operation fails."""


class HypothesisError(ZorynError):
    """Raised when a hypothesis operation fails."""