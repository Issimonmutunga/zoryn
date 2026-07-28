import { useQuery } from "@tanstack/react-query";

import { useTimelineStore } from "@/stores/timelineStore";

import {
  discoveriesApi,
  type DiscoveryDetail,
  type DiscoveryHighlight,
  type DiscoveryHistoryItem,
  type DiscoverySummary,
  type DiscoveryTimelineItem,
} from "@/services/api/discoveries";

export const discoveryQueryKeys = {
  all: (
    timestamp?: string,
  ) =>
    [
      "discoveries",
      timestamp,
    ] as const,

  detail: (
    h3: string,
    timestamp?: string,
  ) =>
    [
      "discoveries",
      h3,
      timestamp,
    ] as const,

  history: (
    h3: string,
    timestamp?: string,
  ) =>
    [
      "discoveries",
      h3,
      "history",
      timestamp,
    ] as const,

  version: [
    "version",
  ] as const,

  timeline: [
    "discoveries",
    "timeline",
  ] as const,

  highlights: (
    timestamp: string,
  ) =>
    [
      "discoveries",
      "highlights",
      timestamp,
    ] as const,
};

export function useDiscoveries() {

  const selectedDate =
    useTimelineStore(
      (
        state,
      ) =>
        state.selectedDate,
    );

  return useQuery<
    DiscoverySummary[]
  >({

    queryKey:
      discoveryQueryKeys.all(
        selectedDate ??
          undefined,
      ),

    queryFn: () =>
      discoveriesApi.getDiscoveries(
        selectedDate ??
          undefined,
      ),

    staleTime:
      5 * 60 * 1000,

  });

}

export function useDiscovery(
  h3: string,
  enabled = true,
) {

  const selectedDate =
    useTimelineStore(
      (
        state,
      ) =>
        state.selectedDate,
    );

  return useQuery<
    DiscoveryDetail
  >({

    queryKey:
      discoveryQueryKeys.detail(
        h3,
        selectedDate ??
          undefined,
      ),

    queryFn: () =>
      discoveriesApi.getDiscovery(
        h3,
        selectedDate ??
          undefined,
      ),

    enabled:
      enabled &&
      h3.length > 0,

    staleTime:
      5 * 60 * 1000,

  });

}

export function useDiscoveryHistory(
  h3: string,
  enabled = true,
) {

  const selectedDate =
    useTimelineStore(
      (
        state,
      ) =>
        state.selectedDate,
    );

  return useQuery<
    DiscoveryHistoryItem
  >({

    queryKey:
      discoveryQueryKeys.history(
        h3,
        selectedDate ??
          undefined,
      ),

    queryFn: () =>
      discoveriesApi.getHistory(
        h3,
        selectedDate ??
          undefined,
      ),

    enabled:
      enabled &&
      h3.length > 0,

    staleTime:
      5 * 60 * 1000,

  });

}

export function useApiVersion() {

  return useQuery({

    queryKey:
      discoveryQueryKeys.version,

    queryFn:
      discoveriesApi.getVersion,

    staleTime:
      Infinity,

  });

}

export function useDiscoveryTimeline() {

  return useQuery<
    DiscoveryTimelineItem[]
  >({

    queryKey:
      discoveryQueryKeys.timeline,

    queryFn:
      discoveriesApi.getTimeline,

    staleTime:
      Infinity,

  });

}

export function useDiscoveryHighlights() {

  const selectedDate =
    useTimelineStore(
      (state) =>
        state.selectedDate,
    );

  return useQuery<
    DiscoveryHighlight[]
  >({

    queryKey:
      discoveryQueryKeys.highlights(
        selectedDate ?? "",
      ),

    queryFn: () =>
      discoveriesApi.getHighlights(
        selectedDate!,
      ),

    enabled:
      selectedDate !== null,

    staleTime:
      5 * 60 * 1000,

  });

}