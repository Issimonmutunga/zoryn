"""
Standardized Precipitation Index (SPI)

This implementation follows the WMO methodology:

1. Compute rolling precipitation accumulation.
2. Partition accumulated precipitation by calendar month.
3. Fit an independent Gamma distribution for each month.
4. Compute the cumulative probability

       H(x) = q + (1 - q) G(x)

   where

       q = probability of zero precipitation
       G = Gamma CDF

5. Transform probabilities to the standard normal distribution.

Only NumPy and SciPy are required.
"""

from __future__ import annotations

import numpy as np

from scipy.stats import gamma
from scipy.stats import norm


EPSILON = 1e-10
MIN_POSITIVE_SAMPLES = 3


def _rolling_sum(
    rainfall: np.ndarray,
    scale: int,
) -> np.ndarray:
    """
    Compute rolling precipitation accumulation.

    Parameters
    ----------
    rainfall
        Monthly precipitation.
    scale
        SPI accumulation scale.

    Returns
    -------
    ndarray

    Same length as rainfall.

    First scale-1 values are NaN.
    """

    rainfall = np.asarray(rainfall, dtype=float)

    n = rainfall.size

    out = np.full(n, np.nan, dtype=float)

    if scale == 1:
        out[:] = rainfall
        return out

    kernel = np.ones(scale, dtype=float)

    accum = np.convolve(rainfall, kernel, mode="valid")

    out[scale - 1 :] = accum

    return out


def _fit_gamma(
    values: np.ndarray,
):
    """
    Fit Gamma(shape, scale) with location fixed to zero.

    Returns
    -------
    tuple(shape, scale)

    or

    None
    """

    values = values[values > 0.0]

    if values.size < MIN_POSITIVE_SAMPLES:
        return None

    if np.allclose(values, values[0]):
        return None

    try:

        shape, _, scale = gamma.fit(
            values,
            floc=0,
        )

        if (
            not np.isfinite(shape)
            or not np.isfinite(scale)
            or shape <= 0
            or scale <= 0
        ):
            return None

        return shape, scale

    except Exception:
        return None


def _gamma_probability(
    x: np.ndarray,
    shape: float,
    scale: float,
    q: float,
) -> np.ndarray:
    """
    Compute

        H(x) = q + (1-q)G(x)

    where G is the Gamma CDF.
    """

    g = gamma.cdf(
        x,
        a=shape,
        loc=0.0,
        scale=scale,
    )

    h = q + (1.0 - q) * g

    return np.clip(
        h,
        EPSILON,
        1.0 - EPSILON,
    )


def _month_spi(
    values: np.ndarray,
) -> np.ndarray:
    """
    Compute SPI for one calendar month series.

    Parameters
    ----------
    values

        Accumulated precipitation for a single
        calendar month across all years.

    Returns
    -------
    ndarray
    """

    spi = np.full(values.shape, np.nan, dtype=float)

    valid = np.isfinite(values)

    if not np.any(valid):
        return spi

    data = values[valid]

    if data.size == 0:
        return spi

    zero_mask = data == 0.0

    q = zero_mask.sum() / data.size

    fit = _fit_gamma(data)

    if fit is None:
        return spi

    shape, scale = fit

    probabilities = np.empty_like(data)

    probabilities[zero_mask] = np.clip(
        q,
        EPSILON,
        1.0 - EPSILON,
    )

    positive = ~zero_mask

    if np.any(positive):

        probabilities[positive] = _gamma_probability(
            data[positive],
            shape,
            scale,
            q,
        )

    spi_values = norm.ppf(probabilities)

    spi_values[~np.isfinite(spi_values)] = np.nan

    spi[valid] = spi_values

    return spi

def compute_spi(
    rainfall: np.ndarray,
    scale: int,
) -> np.ndarray:
    """
    Compute the Standardized Precipitation Index (SPI).

    Parameters
    ----------
    rainfall
        One-dimensional monthly precipitation series.

    scale
        Accumulation period (1, 3, 6, 12, ...).

    Returns
    -------
    ndarray

        SPI values with the same length as the input.

        The first scale-1 values are NaN.
    """

    rainfall = np.asarray(rainfall, dtype=float)

    if rainfall.ndim != 1:
        raise ValueError("rainfall must be one-dimensional")

    if scale < 1:
        raise ValueError("scale must be >= 1")

    if rainfall.size == 0:
        return np.asarray([], dtype=float)

    if np.any(~np.isfinite(rainfall)):
        raise ValueError("rainfall contains non-finite values")

    if np.any(rainfall < 0):
        raise ValueError("rainfall must be non-negative")

    accumulated = _rolling_sum(rainfall, scale)

    spi = np.full(accumulated.shape, np.nan, dtype=float)

    n = accumulated.size

    #
    # Calendar month partition
    #
    # Index 0 -> January
    # Index 1 -> February
    # ...
    # Index 11 -> December
    #
    # Because the accumulation does not change the calendar month of the
    # endpoint, indices separated by 12 belong to the same calendar month.
    #

    for month in range(12):

        month_indices = np.arange(month, n, 12)

        if month_indices.size == 0:
            continue

        month_values = accumulated[month_indices]

        month_spi = _month_spi(month_values)

        spi[month_indices] = month_spi

    #
    # Preserve undefined leading values.
    #

    spi[: scale - 1] = np.nan

    #
    # Numerical safety.
    #

    spi[~np.isfinite(spi)] = np.nan

    return spi