"""
Standardized Precipitation Index (SPI).

Implementation follows the WMO SPI methodology.
"""

from __future__ import annotations

import numpy as np

from scipy.stats import gamma
from scipy.stats import norm


def compute_spi(
    rainfall: np.ndarray,
    scale: int,
) -> np.ndarray:
    """
    Compute SPI for a rainfall time series.

    Parameters
    ----------
    rainfall
        Monthly rainfall (mm).

    scale
        Accumulation period (e.g. 3, 6, 12).

    Returns
    -------
    np.ndarray
        SPI values.
    """

    rainfall = np.asarray(
        rainfall,
        dtype=float,
    )

    if rainfall.ndim != 1:
        raise ValueError(
            "Rainfall must be one-dimensional."
        )

    if scale < 1:
        raise ValueError(
            "Scale must be >= 1."
        )

    accumulated = _rolling_sum(
        rainfall,
        scale,
    )

    spi = np.full(
        accumulated.shape,
        np.nan,
    )

    valid = np.isfinite(accumulated)

    if valid.sum() < 10:
        return spi

    shape, loc, scale_param = gamma.fit(
        accumulated[valid],
        floc=0,
    )

    probability = gamma.cdf(
        accumulated[valid],
        a=shape,
        loc=loc,
        scale=scale_param,
    )

    probability = np.clip(
        probability,
        1e-10,
        1 - 1e-10,
    )

    spi[valid] = norm.ppf(
        probability,
    )

    return spi


def _rolling_sum(
    rainfall: np.ndarray,
    scale: int,
) -> np.ndarray:
    """
    Rolling rainfall accumulation.
    """

    output = np.full_like(
        rainfall,
        np.nan,
        dtype=float,
    )

    for i in range(
        scale - 1,
        len(rainfall),
    ):
        output[i] = rainfall[
            i - scale + 1 : i + 1
        ].sum()

    return output