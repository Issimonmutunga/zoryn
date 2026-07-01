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
    ) -> Iterator[tuple[str, Iterator[Signature]]]:
        """
        Iterate over every H3 history.
        """

        yield from self._builder.iter_histories()

    def replay(
        self,
        callback: Callable[
            [str, Signature],
            None,
        ]
        | None = None,
    ) -> None:
        """
        Replay every history.

        The callback receives:

            (h3_id, signature)
        """

        for h3_id, history in self.histories():

            for signature in history:

                if callback is not None:
                    callback(
                        h3_id,
                        signature,
                    )