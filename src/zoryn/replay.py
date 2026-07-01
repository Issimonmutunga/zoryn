"""
Replay engine.

The ReplayEngine iterates through environmental Signatures in
chronological order and exposes them to downstream reasoning
components.

It performs no learning itself.
"""

from __future__ import annotations

from collections.abc import Callable, Iterator

from zoryn.knowledge import Signature, SignatureBuilder


class ReplayEngine:
    """
    Sequentially replays environmental signatures.
    """

    def __init__(self, builder: SignatureBuilder):
        self._builder = builder

    def __iter__(self) -> Iterator[Signature]:
        """
        Iterate through every Signature.
        """
        yield from self._builder.iter_signatures()

    def replay(
        self,
        callback: Callable[[Signature], None] | None = None,
    ) -> None:
        """
        Replay every Signature.

        If a callback is supplied, it is invoked once per
        Signature.
        """

        for signature in self:

            if callback is not None:
                callback(signature)