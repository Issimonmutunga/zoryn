import { apiClient } from "@/services/api/client";

export interface ScientificReference {
  title: string;
  citation: string;
  url?: string;
}

export interface ScientificRule {
  id: string;
  name: string;
  description: string;
  rationale: string;
}

export interface ScientificStandard {
  id: string;
  name: string;
  version?: string;
  status: "implemented" | "available" | "planned";
  description: string;
  rules: ScientificRule[];
  references: ScientificReference[];
}

export const standardsApi = {
  getStandards() {
    return apiClient.get<ScientificStandard[]>("/standards");
  },

  getStandard(id: string) {
    return apiClient.get<ScientificStandard>(
      `/standards/${encodeURIComponent(id)}`,
    );
  },
};