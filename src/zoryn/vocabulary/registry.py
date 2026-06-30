"""
Canonical CF variable registry for Zoryn.

This registry contains the initial Earth-system vocabulary used
by the Nairobi pilot.
"""

from __future__ import annotations

from .cf import CFVariable


REGISTRY: dict[str, CFVariable] = {
    # ------------------------------------------------------------------
    # Atmosphere
    # ------------------------------------------------------------------
    "air_temperature": CFVariable(
        name="air_temperature",
        cf_name="air_temperature",
        units="K",
        description="Near-surface air temperature.",
        category="Atmosphere",
        aliases=("t2m", "temperature"),
    ),
    "precipitation_amount": CFVariable(
        name="precipitation_amount",
        cf_name="precipitation_amount",
        units="mm",
        description="Accumulated precipitation.",
        category="Atmosphere",
        aliases=("rainfall", "precipitation"),
    ),
    "relative_humidity": CFVariable(
        name="relative_humidity",
        cf_name="relative_humidity",
        units="%",
        description="Near-surface relative humidity.",
        category="Atmosphere",
    ),
    "surface_air_pressure": CFVariable(
        name="surface_air_pressure",
        cf_name="surface_air_pressure",
        units="Pa",
        description="Surface air pressure.",
        category="Atmosphere",
    ),
    "wind_speed": CFVariable(
        name="wind_speed",
        cf_name="wind_speed",
        units="m s-1",
        description="Wind speed.",
        category="Atmosphere",
    ),

    # ------------------------------------------------------------------
    # Hydrology
    # ------------------------------------------------------------------
    "soil_moisture": CFVariable(
        name="soil_moisture",
        cf_name="soil_moisture_content",
        units="m3 m-3",
        description="Volumetric soil moisture.",
        category="Hydrology",
        aliases=("sm",),
    ),
    "terrestrial_water_storage": CFVariable(
        name="terrestrial_water_storage",
        cf_name="terrestrial_water_storage",
        units="mm",
        description="Terrestrial water storage anomaly.",
        category="Hydrology",
        aliases=("tws",),
    ),
    "river_discharge": CFVariable(
        name="river_discharge",
        cf_name="water_volume_transport_in_river_channel",
        units="m3 s-1",
        description="River discharge.",
        category="Hydrology",
    ),

    # ------------------------------------------------------------------
    # Land Surface
    # ------------------------------------------------------------------
    "surface_elevation": CFVariable(
        name="surface_elevation",
        cf_name="surface_altitude",
        units="m",
        description="Surface elevation.",
        category="Land Surface",
    ),
    "land_cover": CFVariable(
        name="land_cover",
        cf_name="land_cover",
        units="class",
        description="Land cover classification.",
        category="Land Surface",
    ),

    # ------------------------------------------------------------------
    # Vegetation
    # ------------------------------------------------------------------
    "normalized_difference_vegetation_index": CFVariable(
        name="normalized_difference_vegetation_index",
        cf_name="normalized_difference_vegetation_index",
        units="1",
        description="Vegetation greenness.",
        category="Vegetation",
        aliases=("ndvi",),
    ),

    # ------------------------------------------------------------------
    # Human
    # ------------------------------------------------------------------
    "population_density": CFVariable(
        name="population_density",
        cf_name="population_density",
        units="persons km-2",
        description="Population density.",
        category="Human",
    ),

    # ------------------------------------------------------------------
    # Events
    # ------------------------------------------------------------------
    "hazard_event": CFVariable(
        name="hazard_event",
        cf_name="hazard_event",
        units="category",
        description="Observed hazard occurrence.",
        category="Events",
    ),
}