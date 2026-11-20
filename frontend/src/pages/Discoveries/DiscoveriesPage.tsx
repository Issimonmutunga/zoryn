import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronRight, Info } from "lucide-react";

import {
  Container,
  MonoLabel,
  PageHeader,
  PageShell,
} from "@/components/page/PageShell";
import {
  ConfidenceBar,
  SpiChip,
  StatRow,
  StatTile,
} from "@/components/page/Figures";
import MonthPicker from "@/components/page/MonthPicker";
import {
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonRows,
} from "@/components/page/States";
import { useDiscoveryTimeline } from "@/hooks/useDiscoveries";
import { useDiscoveriesAt } from "@/hooks/useKnowledge";
import { FONT_MONO } from "@/lib/fonts";
import type { DiscoverySummary } from "@/services/api/discoveries";
import { discoveryLink, shortH3 } from "@/utils/location";
import {
  formatDuration,
  formatMonth,
  formatPeriod,
  isMonthKey,
  monthSpan,
} from "@/utils/months";
import { formatSpi } from "@/utils/spi";
import { uniqueBy } from "@/utils/unique";

// "What has Zoryn found?" - every discovery for one month as a list. This is
// the phone-friendly counterpart of the Explorer map: the same discoveries,
// sortable and filterable, each opening its full reasoning.

type SortKey = "confidence" | "driest" | "longest";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "confidence", label: "Highest confidence" },
  { key: "driest", label: "Driest (lowest SPI-3)" },
  { key: "longest", label: "Longest evidence window" },
];

const CONFIDENCE_FILTERS = [
  { value: 0, label: "All" },
  { value: 0.5, label: "50%+" },
  { value: 0.75, label: "75%+" },
];

// The API returns a whole month at once, so the list is paged on the client.
const PAGE_SIZE = 50;

// Months above this size are slow to download on a phone; the page says so.
const LARGE_MONTH = 5000;

function span(discovery: DiscoverySummary): number {
  return monthSpan(discovery.start, discovery.end) ?? 0;
}

function sortDiscoveries(
  rows: DiscoverySummary[],
  sort: SortKey,
): DiscoverySummary[] {
  const sorted = [...rows];

  if (sort === "driest") {
    sorted.sort(
      (a, b) =>
        (a.spi3 ?? Number.POSITIVE_INFINITY) -
        (b.spi3 ?? Number.POSITIVE_INFINITY),
    );
  } else if (sort === "longest") {
    sorted.sort((a, b) => span(b) - span(a) || b.confidence - a.confidence);
  } else {
    sorted.sort(
      (a, b) =>
        b.confidence - a.confidence ||
        (a.spi3 ?? Number.POSITIVE_INFINITY) -
          (b.spi3 ?? Number.POSITIVE_INFINITY),
    );
  }

  return sorted;
}

export default function DiscoveriesPage() {
  const [params, setParams] = useSearchParams();

  const timeline = useDiscoveryTimeline();
  const months = useMemo(
    () =>
      [...(timeline.data ?? [])].sort((a, b) =>
        a.timestamp.localeCompare(b.timestamp),
      ),
    [timeline.data],
  );

  const requested = params.get("date");
  const latest = months.length > 0 ? months[months.length - 1].timestamp : null;
  const month = isMonthKey(requested) ? requested : latest;

  const discoveries = useDiscoveriesAt(month);

  const [sort, setSort] = useState<SortKey>("confidence");
  const [minConfidence, setMinConfidence] = useState(0);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [month, sort, minConfidence]);

  // The API can return the same discovery twice; show each once.
  const all = useMemo(
    () => uniqueBy(discoveries.data ?? [], (item) => item.id),
    [discoveries.data],
  );
  const merged = (discoveries.data?.length ?? 0) - all.length;

  const rows = useMemo(
    () =>
      sortDiscoveries(
        all.filter((item) => item.confidence >= minConfidence),
        sort,
      ),
    [all, sort, minConfidence],
  );

  const stats = useMemo(() => {
    if (all.length === 0) {
      return null;
    }

    const spiValues = all
      .map((item) => item.spi3)
      .filter((value): value is number => typeof value === "number");

    return {
      total: all.length,
      high: all.filter((item) => item.confidence >= 0.75).length,
      driest: spiValues.length > 0 ? Math.min(...spiValues) : null,
      longest: Math.max(...all.map(span)),
    };
  }, [all]);

  const monthCount =
    months.find((item) => item.timestamp === month)?.discoveries ?? null;

  function selectMonth(next: string) {
    setParams({ date: next }, { replace: true });
  }

  return (
    <PageShell>
      <PageHeader
        question="What has Zoryn found?"
        title="Discoveries"
        lede="Every environmental discovery for a month, with its confidence, its SPI reading and the period of evidence behind it. Open one to follow the reasoning."
      />

      <Container className="py-8 sm:py-12">
        {timeline.isError ? (
          <ErrorState
            error={timeline.error}
            subject="The discovery timeline"
            onRetry={() => void timeline.refetch()}
          />
        ) : (
          <>
            {/* ------------------------------------------------ Filters */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <div className="lg:w-96">
                <MonoLabel className="mb-1.5">Month</MonoLabel>

                {timeline.isLoading ? (
                  <Skeleton className="h-11 w-full" />
                ) : (
                  <MonthPicker
                    months={months}
                    value={month}
                    onChange={selectMonth}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-1 lg:justify-end">
                <div className="lg:w-64">
                  <MonoLabel className="mb-1.5">Sort by</MonoLabel>

                  <div className="relative">
                    <select
                      aria-label="Sort discoveries by"
                      value={sort}
                      onChange={(event) =>
                        setSort(event.target.value as SortKey)
                      }
                      className="h-11 w-full appearance-none rounded-lg border border-[#E5E5E5] bg-white pl-3 pr-9 text-base text-[#1A1A1A] outline-none focus-visible:border-[#1A1A1A] sm:text-sm"
                    >
                      {SORTS.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div>
                  <MonoLabel className="mb-1.5">Confidence</MonoLabel>

                  <div
                    role="group"
                    aria-label="Minimum confidence"
                    className="grid h-11 grid-cols-3 rounded-lg border border-[#E5E5E5] bg-white p-1 lg:w-56"
                  >
                    {CONFIDENCE_FILTERS.map((option) => {
                      const active = minConfidence === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setMinConfidence(option.value)}
                          className={`rounded-md text-sm transition-colors ${
                            active
                              ? "bg-[#1A1A1A] font-medium text-white"
                              : "text-[#5A5A5A] hover:bg-[#F2F2F2]"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {monthCount !== null && monthCount >= LARGE_MONTH && (
              <p className="mt-4 flex items-start gap-2 rounded-lg border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm leading-6 text-[#5A5A5A]">
                <Info
                  className="mt-1 h-4 w-4 shrink-0 text-[#6B6B6B]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                {formatMonth(month ?? "")} has {monthCount.toLocaleString()}{" "}
                discoveries. They are downloaded together before they can be
                sorted, which can take a while on a slow connection.
              </p>
            )}

            {/* ------------------------------------------------- Figures */}
            <div className="mt-6">
              {stats ? (
                <StatRow>
                  <StatTile
                    label="Discoveries this month"
                    value={stats.total.toLocaleString()}
                    hint={month ? formatMonth(month) : undefined}
                  />
                  <StatTile
                    label="High confidence"
                    value={stats.high.toLocaleString()}
                    hint="75% or above"
                  />
                  <StatTile
                    label="Driest SPI-3"
                    value={formatSpi(stats.driest)}
                    hint={<SpiChip value={stats.driest} showValue={false} />}
                  />
                  <StatTile
                    label="Longest evidence window"
                    value={formatDuration(stats.longest)}
                    hint="First to last supporting month"
                  />
                </StatRow>
              ) : (
                (discoveries.isLoading || timeline.isLoading) && (
                  <StatRow>
                    {Array.from({ length: 4 }, (_, index) => (
                      <Skeleton key={index} className="h-24" />
                    ))}
                  </StatRow>
                )
              )}
            </div>

            {/* ---------------------------------------------------- List */}
            <div className="mt-6">
              {discoveries.isError ? (
                <ErrorState
                  error={discoveries.error}
                  subject="The discovery list"
                  onRetry={() => void discoveries.refetch()}
                />
              ) : discoveries.isLoading || timeline.isLoading ? (
                <SkeletonRows rows={6} />
              ) : month === null ? (
                <EmptyState title="No discoveries yet">
                  The knowledge dataset does not contain any discoveries, so
                  there is no month to show.
                </EmptyState>
              ) : all.length === 0 ? (
                <EmptyState title="No environmental discovery">
                  No supported environmental reasoning was produced for{" "}
                  {formatMonth(month)}. That usually means there was not enough
                  evidence, or no recognised pattern, in that month.
                </EmptyState>
              ) : rows.length === 0 ? (
                <EmptyState
                  title="No discoveries at this confidence"
                  action={
                    <button
                      type="button"
                      onClick={() => setMinConfidence(0)}
                      className="min-h-11 rounded-lg border border-[#E5E5E5] bg-white px-4 text-sm font-medium text-[#1A1A1A] hover:bg-[#F2F2F2]"
                    >
                      Show all {all.length.toLocaleString()}
                    </button>
                  }
                >
                  None of the {all.length.toLocaleString()} discoveries in{" "}
                  {formatMonth(month)} reach{" "}
                  {Math.round(minConfidence * 100)}% confidence.
                </EmptyState>
              ) : (
                <>
                  <div
                    aria-hidden="true"
                    className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)_minmax(0,1.3fr)_minmax(0,1.2fr)_1.25rem] gap-4 px-5 pb-2 md:grid"
                  >
                    <MonoLabel>Discovery</MonoLabel>
                    <MonoLabel>Evidence window</MonoLabel>
                    <MonoLabel>SPI-3</MonoLabel>
                    <MonoLabel>Confidence</MonoLabel>
                    <span />
                  </div>

                  <ul className="space-y-2">
                    {rows.slice(0, visible).map((item) => (
                      <li key={item.id}>
                        <DiscoveryRow discovery={item} month={month} />
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-col items-center gap-3">
                    <p className="text-sm text-[#6B6B6B]" aria-live="polite">
                      Showing {Math.min(visible, rows.length).toLocaleString()}{" "}
                      of {rows.length.toLocaleString()}
                      {rows.length !== all.length &&
                        ` (filtered from ${all.length.toLocaleString()})`}
                    </p>

                    {merged > 0 && (
                      <p className="text-center text-xs text-[#8A8A8A]">
                        {merged.toLocaleString()} duplicate{" "}
                        {merged === 1 ? "record" : "records"} returned for this
                        month {merged === 1 ? "was" : "were"} merged.
                      </p>
                    )}

                    {visible < rows.length && (
                      <button
                        type="button"
                        onClick={() => setVisible((count) => count + PAGE_SIZE)}
                        className="min-h-11 w-full rounded-lg border border-[#E5E5E5] bg-white px-5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#F2F2F2] sm:w-auto"
                      >
                        Show {Math.min(PAGE_SIZE, rows.length - visible)} more
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </Container>
    </PageShell>
  );
}

function DiscoveryRow({
  discovery,
  month,
}: {
  discovery: DiscoverySummary;
  month: string;
}) {
  return (
    <Link
      to={discoveryLink(discovery.h3_id, month)}
      className="group block rounded-xl border border-[#E5E5E5] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:border-[#CFCFCF] hover:bg-[#FCFCFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/30 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)_minmax(0,1.3fr)_minmax(0,1.2fr)_1.25rem] md:items-center md:gap-4 md:px-5 md:py-3.5"
    >
      <div className="flex items-start justify-between gap-3 md:block">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold leading-snug text-[#1A1A1A]">
            {discovery.name}
          </p>

          <p
            style={{ fontFamily: FONT_MONO }}
            className="mt-1 truncate text-xs text-[#6B6B6B]"
          >
            H3 {shortH3(discovery.h3_id)}
          </p>
        </div>

        <ChevronRight
          className="mt-0.5 h-4 w-4 shrink-0 text-[#8A8A8A] md:hidden"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 md:contents">
        <div className="col-span-2 md:col-span-1">
          <dt className="md:sr-only">
            <MonoLabel>Evidence window</MonoLabel>
          </dt>
          <dd className="mt-0.5 text-sm text-[#3A3A3A] md:mt-0">
            {formatPeriod(discovery.start, discovery.end)}
            <span className="text-[#8A8A8A]">
              {" · "}
              {formatDuration(monthSpan(discovery.start, discovery.end))}
            </span>
          </dd>
        </div>

        <div>
          <dt className="md:sr-only">
            <MonoLabel>SPI-3</MonoLabel>
          </dt>
          <dd className="mt-0.5 md:mt-0">
            <SpiChip value={discovery.spi3} />
          </dd>
        </div>

        <div>
          <dt className="md:sr-only">
            <MonoLabel>Confidence</MonoLabel>
          </dt>
          <dd className="mt-1 md:mt-0">
            <ConfidenceBar value={discovery.confidence} />
          </dd>
        </div>
      </dl>

      <ChevronRight
        className="hidden h-4 w-4 text-[#8A8A8A] transition-transform group-hover:translate-x-0.5 md:block"
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </Link>
  );
}
