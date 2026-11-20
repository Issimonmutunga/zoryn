import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPinned } from "lucide-react";

import {
  Card,
  Container,
  MonoLabel,
  PageHeader,
  PageShell,
  SectionHeading,
} from "@/components/page/PageShell";
import { StatRow, StatTile } from "@/components/page/Figures";
import MonthGrid from "@/components/page/MonthGrid";
import {
  EmptyState,
  ErrorState,
  Skeleton,
} from "@/components/page/States";
import { useDiscoveryTimeline } from "@/hooks/useDiscoveries";
import { FONT_MONO } from "@/lib/fonts";
import { formatMonth, formatMonthShort, parseMonth } from "@/utils/months";
import { plural } from "@/utils/text";

// "When did it happen?" - how many discoveries each month holds, across the
// whole record.
//
// Monthly counts span five orders of magnitude (1 to more than 25,000), so
// the calendar uses order-of-magnitude classes on a single hue rather than a
// linear scale, and a ranked bar list shows the true proportions.

// One hue, light to dark; validated as an ordinal ramp on a white surface.
const BINS = [
  { min: 1, label: "1 – 9", color: "#e9a878" },
  { min: 10, label: "10 – 99", color: "#d98445" },
  { min: 100, label: "100 – 999", color: "#c76b29" },
  { min: 1000, label: "1,000 – 9,999", color: "#9a4d17" },
  { min: 10000, label: "10,000 or more", color: "#6b330c" },
];

const BAR_COLOR = "#c76b29";
const OTHER_COLOR = "#BDBDBD";

const TOP_MONTHS = 6;

function binFor(count: number) {
  let match = BINS[0];

  for (const bin of BINS) {
    if (count >= bin.min) {
      match = bin;
    }
  }

  return match;
}

function share(part: number, total: number): string {
  if (total === 0) {
    return "0%";
  }

  const percent = (part / total) * 100;

  if (percent > 0 && percent < 0.1) {
    return "<0.1%";
  }

  return `${percent >= 10 ? Math.round(percent) : percent.toFixed(1)}%`;
}

export default function TimelinePage() {
  const timeline = useDiscoveryTimeline();

  const months = useMemo(
    () =>
      [...(timeline.data ?? [])].sort((a, b) =>
        a.timestamp.localeCompare(b.timestamp),
      ),
    [timeline.data],
  );

  const [picked, setPicked] = useState<string | null>(null);

  const summary = useMemo(() => {
    if (months.length === 0) {
      return null;
    }

    const total = months.reduce((sum, item) => sum + item.discoveries, 0);
    const ranked = [...months].sort((a, b) => b.discoveries - a.discoveries);
    const first = months[0];
    const last = months[months.length - 1];
    const firstYear = parseMonth(first.timestamp)?.year ?? 0;
    const lastYear = parseMonth(last.timestamp)?.year ?? firstYear;

    return {
      total,
      ranked,
      first,
      last,
      peak: ranked[0],
      years: Array.from(
        { length: lastYear - firstYear + 1 },
        (_, index) => firstYear + index,
      ),
      lookup: new Map(months.map((item) => [item.timestamp, item.discoveries])),
    };
  }, [months]);

  if (timeline.isError) {
    return (
      <PageShell>
        <PageHeader question="When did it happen?" title="Timeline" />
        <Container className="py-8 sm:py-12">
          <ErrorState
            error={timeline.error}
            subject="The discovery timeline"
            onRetry={() => void timeline.refetch()}
          />
        </Container>
      </PageShell>
    );
  }

  const selected = picked ?? summary?.last.timestamp ?? null;
  const selectedCount = selected ? (summary?.lookup.get(selected) ?? 0) : 0;

  const top = summary?.ranked.slice(0, TOP_MONTHS) ?? [];
  const rest = summary?.ranked.slice(TOP_MONTHS) ?? [];
  const restTotal = rest.reduce((sum, item) => sum + item.discoveries, 0);
  const barMax = Math.max(top[0]?.discoveries ?? 0, restTotal, 1);
  const topTwo = top.slice(0, 2);
  const topTwoTotal = topTwo.reduce((sum, item) => sum + item.discoveries, 0);

  return (
    <PageShell>
      <PageHeader
        question="When did it happen?"
        title="Timeline"
        lede="How many discoveries each month holds, across the whole record. A discovery is dated to the last month of its supporting evidence."
      />

      <Container className="space-y-10 py-8 sm:space-y-14 sm:py-12">
        {timeline.isLoading || !summary ? (
          timeline.isLoading ? (
            <div role="status" aria-label="Loading the timeline" className="space-y-4">
              <StatRow>
                {Array.from({ length: 4 }, (_, index) => (
                  <Skeleton key={index} className="h-24" />
                ))}
              </StatRow>
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <EmptyState title="No discoveries yet">
              The knowledge dataset does not contain any discoveries, so there
              is no timeline to draw.
            </EmptyState>
          )
        ) : (
          <>
            {/* ------------------------------------------------- Figures */}
            <StatRow>
              <StatTile
                label="Discoveries"
                value={summary.total.toLocaleString()}
                hint="Across the whole record"
              />
              <StatTile
                label="Months with discoveries"
                value={months.length.toLocaleString()}
                hint={`Of ${summary.years.length * 12} months in ${summary.years[0]} – ${summary.years[summary.years.length - 1]}`}
              />
              <StatTile
                label="Largest month"
                value={formatMonthShort(summary.peak.timestamp)}
                hint={`${summary.peak.discoveries.toLocaleString()} discoveries`}
              />
              <StatTile
                label="Most recent"
                value={formatMonthShort(summary.last.timestamp)}
                hint={plural(summary.last.discoveries, "discovery", "discoveries")}
              />
            </StatRow>

            {/* ------------------------------------------------ Calendar */}
            <section aria-labelledby="calendar-heading">
              <SectionHeading
                id="calendar-heading"
                eyebrow="By month"
                title="Discoveries in each month"
                description="Darker cells hold more discoveries. Select a month to open its discoveries."
              />

              <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">
                <Card>
                  <MonthGrid
                    caption="Discoveries per month"
                    years={summary.years}
                    emptyLabel="no discoveries"
                    selected={selected}
                    onSelect={setPicked}
                    cell={(key) => {
                      const count = summary.lookup.get(key);

                      return count
                        ? {
                            color: binFor(count).color,
                            label: `${formatMonth(key)}: ${plural(count, "discovery", "discoveries")}`,
                          }
                        : null;
                    }}
                  />

                  <div className="mt-5 border-t border-[#E5E5E5] pt-4">
                    <MonoLabel>Discoveries in the month</MonoLabel>

                    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                      <li className="flex items-center gap-1.5 text-xs text-[#5A5A5A]">
                        <span
                          aria-hidden="true"
                          className="h-3 w-3 rounded-[3px] bg-[#F0F0F0]"
                        />
                        None
                      </li>

                      {BINS.map((bin) => (
                        <li
                          key={bin.label}
                          className="flex items-center gap-1.5 text-xs text-[#5A5A5A]"
                        >
                          <span
                            aria-hidden="true"
                            className="h-3 w-3 rounded-[3px]"
                            style={{ backgroundColor: bin.color }}
                          />
                          {bin.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                <Card className="lg:sticky lg:top-24">
                  <MonoLabel>Selected month</MonoLabel>

                  {selected && (
                    <div aria-live="polite">
                      <p className="mt-2 text-xl font-semibold text-[#1A1A1A]">
                        {formatMonth(selected)}
                      </p>

                      <p className="mt-1 text-3xl font-semibold leading-tight text-[#1A1A1A]">
                        {selectedCount.toLocaleString()}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-[#6B6B6B]">
                        {selectedCount === 1 ? "discovery" : "discoveries"},{" "}
                        {share(selectedCount, summary.total)} of the record
                      </p>

                      <div className="mt-5 flex flex-col gap-2">
                        <Link
                          to={`/discoveries?date=${selected}`}
                          className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1A1A1A] px-4 text-sm font-semibold text-white transition-colors hover:bg-black"
                        >
                          View discoveries
                          <ArrowRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                        </Link>

                        <Link
                          to={`/explorer?date=${selected}`}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-4 text-sm font-semibold text-[#3A3A3A] transition-colors hover:bg-[#F2F2F2]"
                        >
                          <MapPinned className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                          Open on map
                        </Link>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </section>

            {/* ------------------------------------------- Concentration */}
            <section aria-labelledby="ranked-heading">
              <SectionHeading
                id="ranked-heading"
                eyebrow="Proportion"
                title="Where the discoveries concentrate"
                description={
                  topTwo.length === 2
                    ? `${formatMonth(topTwo[0].timestamp)} and ${formatMonth(topTwo[1].timestamp)} together hold ${share(topTwoTotal, summary.total)} of all discoveries.`
                    : undefined
                }
              />

              <Card className="mt-5">
                <ul className="space-y-3">
                  {top.map((item) => (
                    <li key={item.timestamp}>
                      <RankedBar
                        to={`/discoveries?date=${item.timestamp}`}
                        label={formatMonthShort(item.timestamp)}
                        value={item.discoveries}
                        max={barMax}
                        total={summary.total}
                        color={BAR_COLOR}
                      />
                    </li>
                  ))}

                  {rest.length > 0 && (
                    <li>
                      <RankedBar
                        label={`${rest.length} other months`}
                        value={restTotal}
                        max={barMax}
                        total={summary.total}
                        color={OTHER_COLOR}
                      />
                    </li>
                  )}
                </ul>
              </Card>
            </section>

            {/* -------------------------------------------------- Table */}
            <section aria-labelledby="table-heading">
              <details className="group rounded-2xl border border-[#E5E5E5] bg-white">
                <summary
                  id="table-heading"
                  className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 text-sm font-semibold text-[#1A1A1A] [&::-webkit-details-marker]:hidden"
                >
                  View every month as a table
                  <span
                    style={{ fontFamily: FONT_MONO }}
                    className="text-[11px] font-normal text-[#6B6B6B] group-open:hidden"
                  >
                    {months.length} rows
                  </span>
                </summary>

                <div className="border-t border-[#E5E5E5]">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">
                      Discoveries per month, most recent first
                    </caption>

                    <thead>
                      <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
                        <th scope="col" className="px-5 py-2.5 font-normal">
                          <MonoLabel>Month</MonoLabel>
                        </th>
                        <th scope="col" className="px-5 py-2.5 text-right font-normal">
                          <MonoLabel>Discoveries</MonoLabel>
                        </th>
                        <th scope="col" className="px-5 py-2.5 text-right font-normal">
                          <MonoLabel>Share</MonoLabel>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {[...months].reverse().map((item) => (
                        <tr
                          key={item.timestamp}
                          className="border-b border-[#F0F0F0] last:border-b-0"
                        >
                          <th scope="row" className="px-5 py-2.5 font-normal">
                            <Link
                              to={`/discoveries?date=${item.timestamp}`}
                              className="text-[#1A1A1A] underline decoration-[#CFCFCF] underline-offset-4 hover:decoration-[#1A1A1A]"
                            >
                              {formatMonth(item.timestamp)}
                            </Link>
                          </th>
                          <td className="px-5 py-2.5 text-right tabular-nums text-[#3A3A3A]">
                            {item.discoveries.toLocaleString()}
                          </td>
                          <td className="px-5 py-2.5 text-right tabular-nums text-[#6B6B6B]">
                            {share(item.discoveries, summary.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </section>
          </>
        )}
      </Container>
    </PageShell>
  );
}

/**
 * One row of the ranked bar list: label, a bar on a shared zero baseline
 * (square at the baseline, rounded at the data end) and the value at its tip.
 */
function RankedBar({
  to,
  label,
  value,
  max,
  total,
  color,
}: {
  to?: string;
  label: string;
  value: number;
  max: number;
  total: number;
  color: string;
}) {
  const width = Math.max((value / max) * 100, 0.6);

  const content = (
    <>
      <span className="w-24 shrink-0 text-sm text-[#3A3A3A] sm:w-32">
        {label}
      </span>

      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span
          aria-hidden="true"
          className="h-4 rounded-r-[4px]"
          style={{ width: `${width}%`, backgroundColor: color }}
        />

        <span className="shrink-0 text-sm font-medium tabular-nums text-[#1A1A1A]">
          {value.toLocaleString()}
          <span className="ml-1.5 hidden font-normal text-[#6B6B6B] sm:inline">
            {share(value, total)}
          </span>
        </span>
      </span>
    </>
  );

  const className = "flex min-h-9 items-center gap-3 rounded-md";

  return to ? (
    <Link
      to={to}
      aria-label={`${label}: ${value.toLocaleString()} discoveries, ${share(value, total)} of the record`}
      className={`${className} -mx-2 px-2 transition-colors hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/30`}
    >
      {content}
    </Link>
  ) : (
    <div
      aria-label={`${label}: ${value.toLocaleString()} discoveries, ${share(value, total)} of the record`}
      className={className}
    >
      {content}
    </div>
  );
}
