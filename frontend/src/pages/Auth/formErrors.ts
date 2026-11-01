import { ApiError } from "@/services/api/client";

const NO_ERRORS: Record<string, string[]> = {};

// Field-level validation messages from a failed auth request.
export function fieldErrorsOf(
  error: Error | null,
): Record<string, string[]> {
  return error instanceof ApiError ? error.fieldErrors : NO_ERRORS;
}
