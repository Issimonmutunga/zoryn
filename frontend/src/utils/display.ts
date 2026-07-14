import type { Discovery } from "@/types/discovery";

import { confidenceLabel, formatConfidence } from "@/utils/formatConfidence";
import { formatMonthYear } from "@/utils/formatDate";
import { getHazardLabel } from "@/utils/hazardColors";

export interface DiscoveryDisplay {
  title: string;
  summary: string;
  confidence: string;
  confidenceLabel: string;
  hazard: string;
  period: string;
  scientificBasis: string;
}

export function toDiscoveryDisplay(
  discovery: Discovery,
): DiscoveryDisplay {
  return {
    title: discovery.discovery,
    summary: discovery.summary,
    confidence: formatConfidence(discovery.confidence),
    confidenceLabel: confidenceLabel(discovery.confidence),
    hazard: getHazardLabel(discovery.hazard),
    period: formatMonthYear(discovery.timestamp),
    scientificBasis: discovery.scientificBasis,
  };
}

export function truncate(
  value: string,
  maxLength = 120,
): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}…`;
}

export function pluralize(
  value: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return `${value} ${value === 1 ? singular : plural}`;
}