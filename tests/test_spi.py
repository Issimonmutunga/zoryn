import numpy as np

from zoryn.indices import compute_spi


def test_spi_length() -> None:

    rainfall = np.full(
        24,
        100.0,
    )

    spi = compute_spi(
        rainfall,
        scale=3,
    )

    assert len(spi) == len(rainfall)


def test_spi_initial_nan() -> None:

    rainfall = np.full(
        24,
        100.0,
    )

    spi = compute_spi(
        rainfall,
        scale=3,
    )

    assert np.isnan(spi[0])
    assert np.isnan(spi[1])
    assert np.isfinite(spi[2])


def test_spi_mean_near_zero() -> None:

    rng = np.random.default_rng(42)

    rainfall = rng.gamma(
        shape=2.0,
        scale=50.0,
        size=240,
    )

    spi = compute_spi(
        rainfall,
        scale=3,
    )

    valid = spi[np.isfinite(spi)]

    assert abs(valid.mean()) < 0.1