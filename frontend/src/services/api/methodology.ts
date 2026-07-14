import { apiClient } from "@/services/api/client";

export interface MethodologySection {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface MethodologyNode {
  id: string;
  name: string;
  definition: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  applied_rule: string;
  limitations: string[];
}

export interface MethodologyDocument {
  title: string;
  introduction: string;
  philosophy: string;
  sections: MethodologySection[];
  reasoning_chain: MethodologyNode[];
}

export const methodologyApi = {
  getMethodology() {
    return apiClient.get<MethodologyDocument>("/methodology");
  },
};