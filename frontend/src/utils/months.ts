// Helpers for the "YYYY-MM" month keys the API uses for discoveries,
// evidence and the timeline.

export const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export interface MonthKey {
  year: number;
  month: number; // 1-12
}

export function parseMonth(value: string | null | undefined): MonthKey | null {
  if (!value) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (month < 1 || month > 12) {
    return null;
  }

  return { year, month };
}

export function isMonthKey(value: string | null | undefined): value is string {
  return parseMonth(value) !== null && (value as string).length === 7;
}

export function toMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

/** "July 2004" */
export function formatMonth(value: string): string {
  const parsed = parseMonth(value);

  return parsed ? `${MONTH_NAMES[parsed.month - 1]} ${parsed.year}` : value;
}

/** "Jul 2004" */
export function formatMonthShort(value: string): string {
  const parsed = parseMonth(value);

  return parsed ? `${MONTH_ABBR[parsed.month - 1]} ${parsed.year}` : value;
}

/** Inclusive number of months from start to end. */
export function monthSpan(start: string, end: string): number | null {
  const a = parseMonth(start);
  const b = parseMonth(end);

  if (!a || !b) {
    return null;
  }

  return (b.year - a.year) * 12 + (b.month - a.month) + 1;
}

/** "May – Jul 2004", "Dec 2004 – Feb 2005", or "Jul 2004" for one month. */
export function formatPeriod(start: string, end: string): string {
  const a = parseMonth(start);
  const b = parseMonth(end);

  if (!a || !b) {
    return [start, end].filter(Boolean).join(" – ");
  }

  if (a.year === b.year && a.month === b.month) {
    return formatMonthShort(end);
  }

  if (a.year === b.year) {
    return `${MONTH_ABBR[a.month - 1]} – ${MONTH_ABBR[b.month - 1]} ${b.year}`;
  }

  return `${formatMonthShort(start)} – ${formatMonthShort(end)}`;
}

/** "3 months", "1 month", "2 yr 4 mo" for long windows. */
export function formatDuration(months: number | null): string {
  if (months === null || months <= 0) {
    return "—";
  }

  if (months < 24) {
    return `${months} ${months === 1 ? "month" : "months"}`;
  }

  const years = Math.floor(months / 12);
  const rest = months % 12;

  return rest === 0 ? `${years} yr` : `${years} yr ${rest} mo`;
}
