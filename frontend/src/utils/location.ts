// A discovery's location is an H3 cell. H3 indexes are a public geospatial
// reference (like a grid square), so they are shown to users; internal record
// identifiers (patterns, hypotheses, evidence) never are.

/** Drops the trailing padding of an H3 index: "8a7a6325b20ffff" -> "8a7a6325b20". */
export function shortH3(h3Id: string): string {
  const trimmed = h3Id.replace(/f+$/i, "");

  return trimmed.length > 0 ? trimmed : h3Id;
}

export function explorerLink(h3Id: string, month: string | null): string {
  const query = new URLSearchParams({ h3: h3Id });

  if (month) {
    query.set("date", month);
  }

  return `/explorer?${query.toString()}`;
}

export function discoveryLink(h3Id: string, month: string | null): string {
  const base = `/discoveries/${encodeURIComponent(h3Id)}`;

  return month ? `${base}?date=${encodeURIComponent(month)}` : base;
}

export function graphLink(h3Id: string, month: string | null): string {
  const query = new URLSearchParams({ h3: h3Id });

  if (month) {
    query.set("date", month);
  }

  return `/knowledge-graph?${query.toString()}`;
}
