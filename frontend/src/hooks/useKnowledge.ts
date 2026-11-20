import { useQueries, useQuery } from "@tanstack/react-query";

import {
  discoveriesApi,
  type DiscoverySummary,
} from "@/services/api/discoveries";
import { explanationApi } from "@/services/api/explanations";
import { reasoningApi, type Evidence } from "@/services/api/reasoning";
import { systemApi } from "@/services/api/system";
import { discoveryQueryKeys } from "@/hooks/useDiscoveries";

// Query hooks for the standalone views. Unlike the Explorer hooks these take
// the month explicitly (from the URL) instead of reading the map's timeline
// store, so a view can be linked to and reloaded on its own. Query keys match
// the Explorer's, so both share one cache.

const FIVE_MINUTES = 5 * 60 * 1000;

export function useDiscoveriesAt(month: string | null) {
  return useQuery<DiscoverySummary[]>({
    queryKey: discoveryQueryKeys.all(month ?? undefined),
    queryFn: () => discoveriesApi.getDiscoveries(month ?? undefined),
    enabled: month !== null,
    staleTime: FIVE_MINUTES,
  });
}

export function useReasoningAt(h3Id: string, month: string | null) {
  return useQuery({
    queryKey: ["reasoning", h3Id, month],
    queryFn: () => reasoningApi.getReasoning(h3Id, month ?? undefined),
    enabled: h3Id.length > 0,
    staleTime: FIVE_MINUTES,
  });
}

export function useExplanationAt(
  h3Id: string,
  month: string | null,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["explanation", h3Id, month],
    queryFn: () => explanationApi.getExplanation(h3Id, month ?? undefined),
    enabled: enabled && h3Id.length > 0,
    staleTime: FIVE_MINUTES,
    retry: false,
  });
}

/** Evidence behind each of the given patterns, fetched in parallel. */
export function usePatternEvidence(patternIds: string[]) {
  return useQueries({
    queries: patternIds.map((id) => ({
      queryKey: ["pattern-evidence", id],
      queryFn: (): Promise<Evidence[]> => reasoningApi.getPatternEvidence(id),
      staleTime: FIVE_MINUTES,
    })),
  });
}

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: systemApi.getHealth,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnMount: "always",
  });
}
