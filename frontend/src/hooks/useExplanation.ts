import { useQuery } from "@tanstack/react-query";

import { useTimelineStore } from "@/stores/timelineStore";

import { explanationApi } from "@/services/api/explanations";

export function useExplanation(
  h3Id: string,
  enabled = true,
) {

  const selectedDate =
    useTimelineStore(
      (state) => state.selectedDate,
    );

  return useQuery({

    queryKey: [
      "explanation",
      h3Id,
      selectedDate,
    ],

    queryFn: () =>
      explanationApi.getExplanation(
        h3Id,
        selectedDate ?? undefined,
      ),

    enabled:
      enabled &&
      h3Id.length > 0,

    staleTime:
      5 * 60 * 1000,

  });

}