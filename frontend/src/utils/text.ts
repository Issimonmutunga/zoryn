/** "persistent_dryness" -> "Persistent dryness". */
export function humanize(value: string): string {
  const text = value.replace(/[_-]+/g, " ").trim();

  return text.length > 0 ? text[0].toUpperCase() + text.slice(1) : value;
}

export function plural(count: number, singular: string, pluralForm?: string) {
  return `${count.toLocaleString()} ${
    count === 1 ? singular : (pluralForm ?? `${singular}s`)
  }`;
}
