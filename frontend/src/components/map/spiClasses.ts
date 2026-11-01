import type { ExpressionSpecification } from "maplibre-gl";

// WMO Standardized Precipitation Index classes, shared by the map fill
// and the legend so the two always agree. Dry classes include their upper
// bound (SPI -1.0 is moderately dry), matching the reasoning engine's
// SPI <= -1 drought threshold.
export interface SpiClass {
  label: string;
  color: string;
}

export const SPI_CLASSES: SpiClass[] = [
  { label: "Extremely Wet (≥ 2.0)", color: "#08306b" },
  { label: "Very Wet (1.5 to 2.0)", color: "#2171b5" },
  { label: "Moderately Wet (1.0 to 1.5)", color: "#6baed6" },
  { label: "Near Normal (-1.0 to 1.0)", color: "#d9d9d9" },
  { label: "Moderate Drought (-1.0 to -1.5)", color: "#fdd835" },
  { label: "Severe Drought (-1.5 to -2.0)", color: "#fb8c00" },
  { label: "Extreme Drought (≤ -2.0)", color: "#c62828" },
];

export const SPI_FILL_OPACITY = 0.55;

const [extremelyWet, veryWet, moderatelyWet, nearNormal, moderateDrought, severeDrought, extremeDrought] =
  SPI_CLASSES.map((spiClass) => spiClass.color);

const spi3: ExpressionSpecification = ["to-number", ["get", "spi3"]];

// MapLibre expression assigning each cell its class colour.
export const SPI_FILL_COLOR: ExpressionSpecification = [
  "case",
  ["<=", spi3, -2], extremeDrought,
  ["<=", spi3, -1.5], severeDrought,
  ["<=", spi3, -1], moderateDrought,
  ["<", spi3, 1], nearNormal,
  ["<", spi3, 1.5], moderatelyWet,
  ["<", spi3, 2], veryWet,
  extremelyWet,
];
