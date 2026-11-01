import { ApiError } from "@/services/api/client";

import type {
  AuthSession,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

// Accounts are served by the .NET API, separately from the Python
// reasoning API that `apiClient` talks to.
const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_API_BASE_URL ??
  "http://localhost:5202";

interface ProblemDetails {
  title?: string;
  errors?: Record<string, string[]>;
}

// ASP.NET returns RFC 7807 problem details. Messages tied to a request
// field are kept apart so forms can show them beside that field; the rest
// form the error's message.
async function readProblem(
  response: Response,
): Promise<ApiError> {

  if (response.status >= 500) {
    return new ApiError(
      "Something went wrong on our side. Please try again shortly.",
      response.status,
    );
  }

  let body: ProblemDetails = {};

  try {
    body = await response.json();
  } catch {
    //
    // Not JSON; fall back to the status text.
    //
  }

  const fieldErrors: Record<string, string[]> = {};
  const generalErrors: string[] = [];

  for (const [key, messages] of Object.entries(body.errors ?? {})) {
    // Model binding may report JSON paths such as "$.email".
    const field = key.replace(/^\$\./, "").toLowerCase();

    if (field) {
      fieldErrors[field] = [...(fieldErrors[field] ?? []), ...messages];
    } else {
      generalErrors.push(...messages);
    }
  }

  const message =
    generalErrors.join(" ") ||
    (Object.keys(fieldErrors).length > 0
      ? "Please correct the highlighted fields."
      : body.title || response.statusText || "Request failed.");

  return new ApiError(
    message,
    response.status,
    fieldErrors,
  );
}

async function request<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {

  let response: Response;

  try {

    response = await fetch(
      `${AUTH_API_BASE_URL}${endpoint}`,
      {
        ...init,

        headers: {
          Accept: "application/json",
          "Content-Type":
            "application/json",
          ...(init?.headers ??
            {}),
        },
      },
    );

  } catch {

    throw new ApiError(
      "Unable to reach the Zoryn account service. Please try again shortly.",
      0,
    );
  }

  if (!response.ok) {
    throw await readProblem(response);
  }

  return response.json();
}

export const authApi = {

  login(body: LoginRequest) {
    return request<AuthSession>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  },

  register(body: RegisterRequest) {
    return request<AuthSession>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  },

  me(accessToken: string) {
    return request<AuthUser>(
      "/api/auth/me",
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },
      },
    );
  },

};
