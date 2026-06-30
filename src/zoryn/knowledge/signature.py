"""
State signature for Zoryn.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from zoryn.ingestion.schema import Observation


@dataclass(slots=True)
class Signature:
    """
    Represents the complete observed state of a node at a
    particular point in time.
    """

    node_id: str

    timestamp: str

    variables: dict[str, Observation] = field(default_factory=dict)

    def add(self, observation: Observation) -> None:
        """
        Add or update an observation in the signature.
        """
        self.variables[observation.variable] = observation

    def get(self, variable: str) -> Observation | None:
        """
        Retrieve an observation by its canonical variable name.
        """
        return self.variables.get(variable)

    def __contains__(self, variable: str) -> bool:
        return variable in self.variables