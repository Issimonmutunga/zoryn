export type EvidenceStrength = "low" | "moderate" | "high" | "very_high";

export interface Evidence {
  id: string;

  observationId: string;

  variable: string;

  value: number;

  unit?: string;

  timestamp: string;

  strength: EvidenceStrength;

  source: string;

  description: string;
}

export interface EvidenceSummary {
  totalEvidence: number;

  strongestEvidence: Evidence | null;

  averageStrength: EvidenceStrength;
}

export interface EvidenceReference {
  evidenceId: string;

  scientificRule: string;

  scientificStandard: string;
}