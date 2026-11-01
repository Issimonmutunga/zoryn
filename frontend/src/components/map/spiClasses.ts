import type { ExpressionSpecification } from "maplibre-gl";

// WMO Standardized Precipitation Index classes, shared by the map fill,
// the legend and the hover popup so all three always agree. Dry classes
// include their upper bound (SPI -1.0 is moderately dry), matching the
// reasoning engine's SPI <= -1 drought threshold.
export interface SpiClass {
  name: string;
  range: string;
  color: string;
}

export const SPI_CLASSES: SpiClass[] = [
  { name: "Extremely Wet", range: "≥ 2.0", color: "#08306b" },
  { name: "Very Wet", range: "1.5 to 2.0", color: "#2171b5" },
  { name: "Moderately Wet", range: "1.0 to 1.5", color: "#6baed6" },
  { name: "Near Normal", range: "-1.0 to 1.0", color: "#d9d9d9" },
  { name: "Moderate Drought", range: "-1.0 to -1.5", color: "#fdd835" },
  { name: "Severe Drought", range: "-1.5 to -2.0", color: "#fb8c00" },
  { name: "Extreme Drought", range: "≤ -2.0", color: "#c62828" },
];

export const SPI_FILL_OPACITY = 0.55;

const [extremelyWet, veryWet, moderatelyWet, nearNormal, moderateDrought, severeDrought, extremeDrought] =
  SPI_CLASSES;

// The class an SPI value falls in, or null when the cell has no value.
export function spiClassOf(value: number | null | undefined): SpiClass | null {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return null;
  }

  if (value <= -2) return extremeDrought;
  if (value <= -1.5) return severeDrought;
  if (value <= -1) return moderateDrought;
  if (value < 1) return nearNormal;
  if (value < 1.5) return moderatelyWet;
  if (value < 2) return veryWet;

  return extremelyWet;
}

// Cells without an SPI value for the month are left unfilled rather than
// shown as near normal.
export const SPI_NO_DATA_COLOR = "rgba(0, 0, 0, 0)";

const spi3: ExpressionSpecification = ["to-number", ["get", "spi3"]];

// MapLibre expression assigning each cell its class colour; the same
// thresholds as spiClassOf.
export const SPI_FILL_COLOR: ExpressionSpecification = [
  "case",
  ["==", ["get", "spi3"], null], SPI_NO_DATA_COLOR,
  ["<=", spi3, -2], extremeDrought.color,
  ["<=", spi3, -1.5], severeDrought.color,
  ["<=", spi3, -1], moderateDrought.color,
  ["<", spi3, 1], nearNormal.color,
  ["<", spi3, 1.5], moderatelyWet.color,
  ["<", spi3, 2], veryWet.color,
  extremelyWet.color,
];
