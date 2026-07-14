import { apiClient } from "@/services/api/client";

export interface Hypothesis {
  id: string;
  h3_id: string;
  hypothesis: string | null;
}

export interface Pattern {
  id: string;
  hypothesis_id: string;
  name: string;
  confidence?: number;
}

export interface Evidence {
  id: string;
  pattern_id: string;
  variable: string;
  value: string | number;
  unit?: string;
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