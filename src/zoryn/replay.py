"""
Replay engine.

Replays environmental histories independently for each H3 cell.
"""

from __future__ import annotations

from collections.abc import Callable, Iterator

from zoryn.knowledge import Signature, SignatureBuilder


class ReplayEngine:
    """
    Sequentially replays environmental histories.
    """

    def __init__(
        self,
        builder: SignatureBuilder,
    ) -> None:

        self._builder = builder

    def histories(
        self,
        limit: int | None = None,
    ) -> Iterator[tuple[str, Iterator[Signature]]]:
        """
        Iterate over every H3 history.

        Parameters
        ----------
        limit
            Maximum number of histories to yield.
            If None, all histories are replayed.
        """

        count = 0

        for history in self._builder.iter_histories():

            yield history

            count += 1

            if (
                limit is not None
                and count >= limit
            ):
                break

    def replay(
        self,
        callback: Callable[
            [str, Signature],
            None,
        ]
        | None = None,
        limit: int | None = None,
    ) -> None:
        """
        Replay environmental histories.

        Parameters
        ----------
        callback
            Optional callback receiving:

                (h3_id, signature)

        limit
            Maximum number of histories to replay.
            If None, all histories are replayed.
        """

        for h3_id, history in self.histories(
            limit=limit,
        ):

            for signature in history:

                if callback is not None:

                    callback(
                        h3_id,
                        signature,
                    )