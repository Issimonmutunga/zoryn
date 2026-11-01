from zoryn.rest.spatial_repository import SpatialRepository


def test_map_months_are_sorted_and_defined() -> None:

    months = SpatialRepository(None).map_months()

    assert months == sorted(months)
    assert len(months) == len(set(months))

    # SPI-3 needs three months of rainfall, so the pilot record
    # (from January 2002) has no defined value before March.
    assert months[0] == "2002-03"
