import { apiClient } from "@/services/api/client";

export interface Discovery {
  id: string;
  hypothesis_id: string;
  h3_id: string;
  name: string;
  confidence: number;
  start: string;
  end: string;
}

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

export interface ReasoningGraph {
  discovery: Discovery;
  hypothesis: Hypothesis;
  patterns: Pattern[];
  evidence: Evidence[];
}

export const reasoningApi = {
  getReasoning(
    h3Id: string,
  ) {
    return apiClient.get<ReasoningGraph>(
      `/reasoning/${encodeURIComponent(
        h3Id,
      )}`,
    );
  },
};