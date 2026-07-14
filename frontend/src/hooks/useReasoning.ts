import { useQuery } from "@tanstack/react-query";

import { reasoningApi } from "@/services/api/reasoning";

export function useHypothesis(
  hypothesisId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: [
      "hypothesis",
      hypothesisId,
    ],
    queryFn: () =>
      reasoningApi.getHypothesis(
        hypothesisId,
      ),
    enabled:
      enabled &&
      hypothesisId.length > 0,
  });
}

export function usePatterns(
  hypothesisId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: [
      "patterns",
      hypothesisId,
    ],
    queryFn: () =>
      reasoningApi.getPatterns(
        hypothesisId,
      ),
    enabled:
      enabled &&
      hypothesisId.length > 0,
  });
}

export function useEvidence(
  patternId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: [
      "evidence",
      patternId,
    ],
    queryFn: () =>
      reasoningApi.getEvidence(
        patternId,
      ),
    enabled:
      enabled &&
      patternId.length > 0,
  });
}