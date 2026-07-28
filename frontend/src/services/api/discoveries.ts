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

export interface DiscoveryDetail
  extends DiscoverySummary {}

export interface DiscoveryHistoryItem {
  h3_id: string;
  history: Record<
    string,
    unknown
  >[];
}

export interface DiscoveryTimelineItem {
  timestamp: string;
  discoveries: number;
}

export interface DiscoveryHighlight {
  h3_id: string;
}

export interface VersionResponse {
  name: string;
  version: string;
  api: string;
}

export const discoveriesApi = {

  getDiscoveries(
    timestamp?: string,
  ) {

    const endpoint =
      timestamp
        ? `/discoveries?timestamp=${encodeURIComponent(
            timestamp,
          )}`
        : "/discoveries";

    return apiClient.get<
      DiscoverySummary[]
    >(
      endpoint,
    );

  },

  getDiscovery(
    h3Id: string,
    timestamp?: string,
  ) {

    const endpoint =
      timestamp
        ? `/discoveries/${encodeURIComponent(
            h3Id,
          )}?timestamp=${encodeURIComponent(
            timestamp,
          )}`
        : `/discoveries/${encodeURIComponent(
            h3Id,
          )}`;

    return apiClient.get<
      DiscoveryDetail
    >(
      endpoint,
    );

  },

  getHistory(
    h3Id: string,
    timestamp?: string,
  ) {

    const endpoint =
      timestamp
        ? `/history/${encodeURIComponent(
            h3Id,
          )}?timestamp=${encodeURIComponent(
            timestamp,
          )}`
        : `/history/${encodeURIComponent(
            h3Id,
          )}`;

    return apiClient.get<
      DiscoveryHistoryItem
    >(
      endpoint,
    );

  },

  getTimeline() {

    return apiClient.get<
      DiscoveryTimelineItem[]
    >(
      "/discoveries/timeline",
    );

  },

  getHighlights(
    timestamp: string,
  ) {

    return apiClient.get<
      DiscoveryHighlight[]
    >(
      `/discoveries/highlights?timestamp=${encodeURIComponent(
        timestamp,
      )}`,
    );

  },

  getVersion() {

    return apiClient.get<
      VersionResponse
    >(
      "/version",
    );

  },

};