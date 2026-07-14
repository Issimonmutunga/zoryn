import type { HazardType } from "@/types/discovery";

export interface HazardColorScheme {
  background: string;
  foreground: string;
  border: string;
  accent: string;
}

const HAZARD_COLORS: Record<HazardType, HazardColorScheme> = {
  drought: {
    background: "bg-orange-50",
    foreground: "text-orange-700",
    border: "border-orange-200",
    accent: "bg-orange-600",
  },
  flood: {
    background: "bg-blue-50",
    foreground: "text-blue-700",
    border: "border-blue-200",
    accent: "bg-blue-600",
  },
  heat: {
    background: "bg-red-50",
    foreground: "text-red-700",
    border: "border-red-200",
    accent: "bg-red-600",
  },
  vegetation: {
    background: "bg-olive-50",
    foreground: "text-green-700",
    border: "border-green-200",
    accent: "bg-green-700",
  },
  compound: {
    background: "bg-violet-50",
    foreground: "text-violet-700",
    border: "border-violet-200",
    accent: "bg-violet-700",
  },
};

export function getHazardColors(
  hazard: HazardType,
): HazardColorScheme {
  return HAZARD_COLORS[hazard];
}

export function getHazardLabel(hazard: HazardType): string {
  switch (hazard) {
    case "drought":
      return "Drought";
    case "flood":
      return "Flood";
    case "heat":
      return "Extreme Heat";
    case "vegetation":
      return "Vegetation Stress";
    case "compound":
      return "Compound Hazard";
  }
}