export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface HealthResponse {
  status: string;
  version: string;
}

export interface VersionResponse {
  version: string;
}

export interface RepositoryStatistics {
  discoveries: number;
  hypotheses: number;
  patterns: number;
  evidence: number;
}

export interface RepositoryValidation {
  valid: boolean;
  generatedAt: string;
  statistics: RepositoryStatistics;
}