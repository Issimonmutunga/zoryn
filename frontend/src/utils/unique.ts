/**
 * Keeps the first item for each key.
 *
 * The knowledge dataset contains some exact duplicate records, so the API can
 * return the same discovery, pattern or evidence item twice. Views merge them
 * before counting or drawing.
 */
export function uniqueBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const item of items) {
    const value = key(item);

    if (!seen.has(value)) {
      seen.add(value);
      unique.push(item);
    }
  }

  return unique;
}
