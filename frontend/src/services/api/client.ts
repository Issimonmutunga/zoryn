const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000";

export class ApiError extends Error {
  readonly status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);

    this.name = "ApiError";

    this.status = status;
  }
}

async function request<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type":
          "application/json",
        ...(init?.headers ??
          {}),
      },

      ...init,
    },
  );

  if (!response.ok) {

    let message =
      response.statusText;

    try {

      const body =
        await response.json();

      if (
        body &&
        typeof body.detail ===
          "string"
      ) {
        message =
          body.detail;
      }

    } catch {
      //
      // Ignore.
      //
    }

    throw new ApiError(
      message ||
        "API request failed.",
      response.status,
    );
  }

  return response.json();
}

export const apiClient = {

  get<T>(
    endpoint: string,
  ) {
    return request<T>(
      endpoint,
    );
  },

  post<
    TResponse,
    TBody,
  >(
    endpoint: string,
    body: TBody,
  ) {
    return request<TResponse>(
      endpoint,
      {
        method: "POST",

        body: JSON.stringify(
          body,
        ),
      },
    );
  },

};

export {
  API_BASE_URL,
};