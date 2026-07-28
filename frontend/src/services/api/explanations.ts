import { apiClient } from "@/services/api/client";

export interface Explanation {
  provider: string;
  model: string;
  reasoning_version: string;
  explanation: string;
  latency_ms: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  finish_reason: string;
  generated_at: string;
}

export interface ScientificReference {
  source: string;
  section: string;
  title: string;
  excerpt: string;
}

export interface ExplanationResponse extends Explanation {
  references: ScientificReference[];
}

export const explanationApi = {

  getExplanation(
    h3: string,
    timestamp?: string,
  ) {

    const query =
      timestamp
        ? `?timestamp=${encodeURIComponent(timestamp)}`
        : "";

    return apiClient.get<ExplanationResponse>(
      `/reasoning/${encodeURIComponent(
        h3,
      )}/explanation${query}`,
    );

  },

};