import { apiClient } from "@/services/api/client";

export interface DiscoverySummary {
  h3: string;
  discovery: string;
  confidence: number;
  summary: string;
  scientific_basis: string;
  timestamp: string;
}

export interface DiscoveryDetail extends DiscoverySummary {
  evidence_count: number;
  pattern_count: number;
  rule_count: number;
}

export interface DiscoveryHistoryItem {
  timestamp: string;
  discovery: string;
  confidence: number;
}

export const discoveriesApi = {
  getDiscoveries() {
    return apiClient.get<DiscoverySummary[]>("/discoveries");
  },

  getDiscovery(h3: string) {
    return apiClient.get<DiscoveryDetail>(
      `/discoveries/${encodeURIComponent(h3)}`,
    );
  },

  getHistory(h3: string) {
    return apiClient.get<DiscoveryHistoryItem[]>(
      `/history/${encodeURIComponent(h3)}`,
    );
  },

  getVersion() {
    return apiClient.get<{
      version: string;
    }>("/version");
  },
};