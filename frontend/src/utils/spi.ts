// WMO Standardized Precipitation Index classes. Labels, ranges and colours
// match the Explorer's map legend so a class reads the same everywhere.

export interface SpiClass {
  key: string;
  label: string;
  range: string;
  color: string;
}

export const SPI_CLASSES: SpiClass[] = [
  { key: "extremely-wet", label: "Extremely wet", range: "2.0 or above", color: "#08306b" },
  { key: "very-wet", label: "Very wet", range: "1.5 to 2.0", color: "#2171b5" },
  { key: "moderately-wet", label: "Moderately wet", range: "1.0 to 1.5", color: "#6baed6" },
  { key: "near-normal", label: "Near normal", range: "-1.0 to 1.0", color: "#d9d9d9" },
  { key: "moderate-drought", label: "Moderate drought", range: "-1.5 to -1.0", color: "#fdd835" },
  { key: "severe-drought", label: "Severe drought", range: "-2.0 to -1.5", color: "#fb8c00" },
  { key: "extreme-drought", label: "Extreme drought", range: "below -2.0", color: "#c62828" },
];

export function classifySpi(value: number | null | undefined): SpiClass | null {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }

  if (value >= 2) return SPI_CLASSES[0];
  if (value >= 1.5) return SPI_CLASSES[1];
  if (value >= 1) return SPI_CLASSES[2];
  if (value > -1) return SPI_CLASSES[3];
  if (value > -1.5) return SPI_CLASSES[4];
  if (value > -2) return SPI_CLASSES[5];

  return SPI_CLASSES[6];
}

/** "-0.45", "+0.81"; an em dash when there is no value. */
export function formatSpi(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  const rounded = Math.round(value * 100) / 100;
  const text = Math.abs(rounded).toFixed(2);

  if (rounded > 0) return `+${text}`;
  if (rounded < 0) return `−${text}`;

  return text;
}
