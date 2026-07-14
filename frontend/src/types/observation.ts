export type ObservationType =
  | "precipitation"
  | "temperature"
  | "soil_moisture"
  | "vegetation"
  | "surface_water"
  | "evapotranspiration"
  | "custom";

export interface Observation {
  id: string;

  h3: string;

  timestamp: string;

  variable: string;

  type: ObservationType;

  value: number;

  unit: string;

  source: string;

  quality: "observed" | "derived" | "estimated";

  metadata?: Record<string, string | number | boolean>;
}

export interface ObservationSeries {
  h3: string;

  variable: string;

  observations: Observation[];
}

export interface ObservationSummary {
  totalObservations: number;

  firstObservation: string;

  lastObservation: string;

  variables: string[];
}