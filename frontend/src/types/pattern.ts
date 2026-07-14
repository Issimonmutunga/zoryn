export type PatternCategory =
  | "persistent_dryness"
  | "persistent_wetness"
  | "heat_accumulation"
  | "vegetation_stress"
  | "compound";

export interface Pattern {
  id: string;

  name: string;

  category: PatternCategory;

  description: string;

  confidence: number;

  frequency: number;

  appliedRule: string;
}

export interface PatternRelationship {
  sourcePatternId: string;
  targetPatternId: string;
  relationship: string;
}

export interface PatternSummary {
  totalPatterns: number;
  dominantPattern: string;
  averageConfidence: number;
}