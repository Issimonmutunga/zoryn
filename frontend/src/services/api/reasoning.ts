import { apiClient } from "@/services/api/client";

export interface Hypothesis {
  id: string;
  name: string;
  confidence: number;
}

export interface Pattern {
  id: string;
  name: string;
  confidence: number;
  frequency: number;
  standard: string;
}

export interface Evidence {
  id: string;
  h3_id: string;
  timestamp: string;
  variable: string;
  direction: string;
  strength: number;
}

export const reasoningApi = {
  getHypothesis(
    hypothesisId: string,
  ) {
    return apiClient.get<Hypothesis>(
      `/hypotheses/${encodeURIComponent(
        hypothesisId,
      )}`,
    );
  },

  getPatterns(
    hypothesisId: string,
  ) {
    return apiClient.get<Pattern[]>(
      `/patterns/${encodeURIComponent(
        hypothesisId,
      )}`,
    );
  },

  getEvidence(
    patternId: string,
  ) {
    return apiClient.get<Evidence[]>(
      `/evidence/${encodeURIComponent(
        patternId,
      )}`,
    );
  },
};