export type HazardType =
  | "drought"
  | "flood"
  | "heat"
  | "vegetation"
  | "compound";

export interface Discovery {
  h3: string;
  timestamp: string;

  discovery: string;
  summary: string;

  confidence: number;

  hazard: HazardType;

  scientificBasis: string;

  evidenceCount: number;
  patternCount: number;
  ruleCount: number;
}

export interface DiscoveryHistory {
  timestamp: string;
  discovery: string;
  confidence: number;
}

export interface DiscoverySearchResult {
  h3: string;
  discovery: string;
  confidence: number;
}