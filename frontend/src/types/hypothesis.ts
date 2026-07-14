export type HypothesisStatus =
  | "developing"
  | "active"
  | "recovering"
  | "resolved"
  | "monitoring";

export interface Hypothesis {
  id: string;

  name: string;

  description: string;

  status: HypothesisStatus;

  confidence: number;

  supportingPatternIds: string[];

  supportingEvidenceCount: number;

  scientificRule: string;
}

export interface HypothesisEvaluation {
  hypothesisId: string;

  accepted: boolean;

  confidence: number;

  rationale: string;
}

export interface HypothesisSummary {
  totalHypotheses: number;

  acceptedHypotheses: number;

  highestConfidence: number;
}