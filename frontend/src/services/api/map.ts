import { apiClient } from "@/services/api/client";

export interface MapFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  properties: Record<string, unknown>;
}

export interface MapFeatureCollection {
  type: "FeatureCollection";
  features: MapFeature[];
}

export interface SpiRecord {
  h3_id: string;
  spi3: number | null;
  timestamp: string;
}

export const mapApi = {
  getGeometry() {
    return apiClient.get<MapFeatureCollection>(
      "/map/geometry",
    );
  },

  getSpi(
    timestamp: string,
  ) {
    return apiClient.get<SpiRecord[]>(
      `/map/spi?timestamp=${encodeURIComponent(
        timestamp,
      )}`,
    );
  },
};