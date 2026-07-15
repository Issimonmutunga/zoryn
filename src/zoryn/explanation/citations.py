"""
Scientific citation repository.

Provides authoritative scientific references used
to support AI-generated explanations.

The repository is deterministic.

Language models never invent citations.
"""

from __future__ import annotations

from .models import ScientificReference


class CitationRepository:
    """
    Scientific reference repository.
    """

    def wmo_spi(self) -> ScientificReference:
        """
        WMO SPI guidance.
        """

        return ScientificReference(
            source="World Meteorological Organization",
            section="SPI User Guide",
            title="Standardized Precipitation Index",
            excerpt=(
                "The Standardized Precipitation Index "
                "(SPI) is recommended for monitoring "
                "meteorological drought at multiple "
                "timescales."
            ),
        )

    def persistent_dryness(self) -> ScientificReference:
        """
        Persistent dryness interpretation.
        """

        return ScientificReference(
            source="World Meteorological Organization",
            section="SPI Interpretation",
            title="Persistent precipitation deficits",
            excerpt=(
                "Sustained negative SPI values indicate "
                "persistent precipitation deficits "
                "consistent with developing "
                "meteorological drought."
            ),
        )

    def confidence(self) -> ScientificReference:
        """
        Confidence interpretation.
        """

        return ScientificReference(
            source="Zoryn Scientific Methodology",
            section="Environmental Reasoning",
            title="Deterministic confidence",
            excerpt=(
                "Confidence represents agreement "
                "between deterministic evidence, "
                "patterns and hypothesis support."
            ),
        )

    def references_for(
        self,
        reasoning_standard: str,
        patterns: list[str],
    ) -> list[ScientificReference]:
        """
        Retrieve references relevant to the supplied
        reasoning.
        """

        references: list[
            ScientificReference
        ] = []

        if reasoning_standard.upper() == "WMO SPI":
            references.append(
                self.wmo_spi()
            )

        if any(
            pattern.lower() == "persistent_dryness"
            for pattern in patterns
        ):
            references.append(
                self.persistent_dryness()
            )

        references.append(
            self.confidence()
        )

        return references