const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message =
      response.statusText || "Knowledge repository request failed.";

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get<T>(endpoint: string) {
    return request<T>(endpoint);
  },

  post<TResponse, TBody>(endpoint: string, body: TBody) {
    return request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};

export { API_BASE_URL };