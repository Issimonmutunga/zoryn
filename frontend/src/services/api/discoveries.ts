import { apiClient } from "@/services/api/client";

export interface DiscoverySummary {
  id: string;
  hypothesis_id: string;
  h3_id: string;
  name: string;
  confidence: number;
  start: string;
  end: string;
}

export interface DiscoveryDetail extends DiscoverySummary {}

export interface DiscoveryHistoryItem {
  h3_id: string;
  history: Record<string, unknown>[];
}

export interface VersionResponse {
  name: string;
  version: string;
  api: string;
}

export const discoveriesApi = {
  getDiscoveries() {
    return apiClient.get<DiscoverySummary[]>(
      "/discoveries",
    );
  },

  getDiscovery(
    h3Id: string,
  ) {
    return apiClient.get<DiscoveryDetail>(
      `/discoveries/${encodeURIComponent(h3Id)}`,
    );
  },

  getHistory(
    h3Id: string,
  ) {
    return apiClient.get<DiscoveryHistoryItem>(
      `/history/${encodeURIComponent(h3Id)}`,
    );
  },

  getVersion() {
    return apiClient.get<VersionResponse>(
      "/version",
    );
  },
};