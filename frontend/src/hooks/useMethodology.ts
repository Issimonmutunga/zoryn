import { useQuery } from "@tanstack/react-query";

import {
  methodologyApi,
  type MethodologyDocument,
} from "@/services/api/methodology";

export const methodologyQueryKeys = {
  all: ["methodology"] as const,
};

export function useMethodology() {
  return useQuery<MethodologyDocument>({
    queryKey: methodologyQueryKeys.all,
    queryFn: methodologyApi.getMethodology,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}