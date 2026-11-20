import { ApiError } from "@/services/api/client";

// The UI specification asks every error to say what failed, the likely cause
// and how to recover, and never to show internal exceptions or stack traces.

export interface ErrorDescription {
  title: string;
  cause: string;
  recovery: string;
  offline: boolean;
}

export function describeError(
  error: unknown,
  subject: string,
): ErrorDescription {
  const title = `${subject} could not be loaded.`;

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return {
      title,
      cause: "This device appears to be offline.",
      recovery: "Reconnect to the internet, then try again.",
      offline: true,
    };
  }

  if (error instanceof ApiError) {
    if (error.status === 404) {
      return {
        title: `${subject} was not found.`,
        cause: "The Zoryn API has no record matching this request.",
        recovery: "Go back and choose another month or location.",
        offline: false,
      };
    }

    if (error.status >= 500) {
      return {
        title,
        cause: "The Zoryn API reported an internal error while reading the knowledge dataset.",
        recovery: "Try again in a moment. If it persists, check the Status page.",
        offline: false,
      };
    }

    return {
      title,
      cause: `The Zoryn API rejected the request (status ${error.status}).`,
      recovery: "Try again, or choose a different month or location.",
      offline: false,
    };
  }

  // fetch() rejects with a TypeError when the server cannot be reached.
  return {
    title,
    cause: "The Zoryn API did not respond.",
    recovery: "Check your connection and that the API is running, then try again.",
    offline: false,
  };
}
