import { useQuery } from "@tanstack/react-query";

import { useTimelineStore } from "@/stores/timelineStore";

import { reasoningApi } from "@/services/api/reasoning";

export function useReasoning(
  h3Id: string,
  enabled = true,
) {

  const selectedDate =
    useTimelineStore(
      (
        state,
      ) =>
        state.selectedDate,
    );

  return useQuery({

    queryKey: [
      "reasoning",
      h3Id,
      selectedDate,
    ],

    queryFn: () =>
      reasoningApi.getReasoning(
        h3Id,
        selectedDate ??
          undefined,
      ),

    enabled:
      enabled &&
      h3Id.length > 0,

    staleTime:
      5 * 60 * 1000,

  });

}