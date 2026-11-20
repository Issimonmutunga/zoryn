import { apiClient } from "@/services/api/client";

export interface HealthResponse {
  status: string;
  discoveries: number;
}

export interface TimedHealth extends HealthResponse {
  /** Round-trip time of the health request, in milliseconds. */
  latencyMs: number;
  checkedAt: string;
}

export const systemApi = {
  async getHealth(): Promise<TimedHealth> {
    const started = performance.now();

    const health = await apiClient.get<HealthResponse>("/health");

    return {
      ...health,
      latencyMs: Math.round(performance.now() - started),
      checkedAt: new Date().toISOString(),
    };
  },
};
