import { useQuery } from "@tanstack/react-query";

import {
  discoveriesApi,
  type DiscoveryDetail,
  type DiscoveryHistoryItem,
  type DiscoverySummary,
} from "@/services/api/discoveries";

export const discoveryQueryKeys = {
  all: ["discoveries"] as const,
  detail: (h3: string) => ["discoveries", h3] as const,
  history: (h3: string) => ["discoveries", h3, "history"] as const,
  version: ["version"] as const,
};

export function useDiscoveries() {
  return useQuery<DiscoverySummary[]>({
    queryKey: discoveryQueryKeys.all,
    queryFn: discoveriesApi.getDiscoveries,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDiscovery(h3: string, enabled = true) {
  return useQuery<DiscoveryDetail>({
    queryKey: discoveryQueryKeys.detail(h3),
    queryFn: () => discoveriesApi.getDiscovery(h3),
    enabled: enabled && h3.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDiscoveryHistory(h3: string, enabled = true) {
  return useQuery<DiscoveryHistoryItem>({
    queryKey: discoveryQueryKeys.history(h3),
    queryFn: () => discoveriesApi.getHistory(h3),
    enabled: enabled && h3.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useApiVersion() {
  return useQuery({
    queryKey: discoveryQueryKeys.version,
    queryFn: discoveriesApi.getVersion,
    staleTime: Infinity,
  });
}