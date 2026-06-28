"""
Episode memory.

Episode memory stores significant episodes discovered during
graph evolution.

Episodes become long-term experiences that can later be used
for analogy, explanation and forecasting.
"""

from __future__ import annotations

from uuid import UUID

from zoryn.core.episode import Episode


class EpisodeMemory:
    """
    Long-term episode memory.
    """

    def __init__(self) -> None:
        self._episodes: dict[UUID, Episode] = {}

    def remember(self, episode: Episode) -> None:
        """
        Store an episode.
        """
        self._episodes[episode.id] = episode

    def recall(self, episode_id: UUID) -> Episode | None:
        """
        Retrieve an episode.
        """
        return self._episodes.get(episode_id)

    def episodes(self) -> tuple[Episode, ...]:
        """
        Return all remembered episodes.
        """
        return tuple(self._episodes.values())

    def contains(self, episode_id: UUID) -> bool:
        """
        Determine whether an episode exists.
        """
        return episode_id in self._episodes

    def clear(self) -> None:
        """
        Remove all remembered episodes.
        """
        self._episodes.clear()

    def __len__(self) -> int:
        return len(self._episodes)