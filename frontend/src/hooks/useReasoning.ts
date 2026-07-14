import { useQuery } from "@tanstack/react-query";

import { reasoningApi } from "@/services/api/reasoning";

export function useReasoning(
  h3Id: string,
  enabled = true,
) {
  return useQuery({
    queryKey: [
      "reasoning",
      h3Id,
    ],

    queryFn: () =>
      reasoningApi.getReasoning(
        h3Id,
      ),

    enabled:
      enabled &&
      h3Id.length > 0,

    staleTime: 5 * 60 * 1000,
  });
}