const DEFAULT_REDIRECT = "/explorer";

// Where to send the user after signing in. Only same-site paths are
// honoured, so a crafted `from` can't bounce users to another origin.
export function getRedirectTarget(state: unknown): string {
  const from =
    typeof state === "object" && state !== null && "from" in state
      ? (state as { from: unknown }).from
      : null;

  if (
    typeof from === "string" &&
    from.startsWith("/") &&
    !from.startsWith("//") &&
    !from.startsWith("/login") &&
    !from.startsWith("/signup")
  ) {
    return from;
  }

  return DEFAULT_REDIRECT;
}
