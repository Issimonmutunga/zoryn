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

// ASP.NET returns RFC 7807 problem details; collect every message so
// Identity's password rules can all be shown at once.
async function readProblem(
  response: Response,
): Promise<string> {

  if (response.status >= 500) {
    return "Something went wrong on our side. Please try again shortly.";
  }

  try {

    const body: ProblemDetails =
      await response.json();

    const messages = Object.values(
      body.errors ?? {},
    ).flat();

    if (messages.length > 0) {
      return messages.join(" ");
    }

    if (body.title) {
      return body.title;
    }

  } catch {
    //
    // Ignore.
    //
  }

  return response.statusText ||
    "Request failed.";
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
    throw new ApiError(
      await readProblem(response),
      response.status,
    );
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
