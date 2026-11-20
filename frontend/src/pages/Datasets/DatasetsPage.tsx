import { useMemo } from "react";
import type { ElementType } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CloudRain,
  Database,
  Gauge,
  Hexagon,
  MapPinned,
} from "lucide-react";

import {
  Card,
  Container,
  MonoLabel,
  PageHeader,
  PageShell,
  Pill,
  SectionHeading,
} from "@/components/page/PageShell";
import { StatTile } from "@/components/page/Figures";
import { ErrorState, Skeleton } from "@/components/page/States";
import { useDiscoveryTimeline } from "@/hooks/useDiscoveries";
import { useHealth } from "@/hooks/useKnowledge";
import { formatMonthShort } from "@/utils/months";

// "What is it built on?" - the data the pilot reads, what Zoryn derives from
// it, and what it keeps. Descriptions are fixed; the figures for the
// knowledge dataset are read live from the API.

type Dataset = {
  icon: ElementType;
  kind: string;
  name: string;
  source: string;
  role: string;
  facts: { label: string; value: string }[];
};

const INPUTS: Dataset[] = [
  {
    icon: CloudRain,
    kind: "Observation",
    name: "CHIRPS monthly precipitation",
    source: "Climate Hazards Center, UC Santa Barbara",
    role: "The rainfall observed each month. Every piece of evidence starts from this record.",
    facts: [
      { label: "Variable", value: "Precipitation amount" },
      { label: "Time step", value: "Monthly" },
    ],
  },
  {
    icon: MapPinned,
    kind: "Boundary",
    name: "Nairobi County boundary",
    source: "Administrative boundary",
    role: "Defines the pilot area. Nothing outside it is analysed.",
    facts: [{ label: "Coverage", value: "Nairobi County, Kenya" }],
  },
  {
    icon: Hexagon,
    kind: "Grid",
    name: "H3 grid, resolution 10",
    source: "H3 hexagonal grid system",
    role: "Divides the pilot area into equal hexagonal cells. Each discovery belongs to one cell.",
    facts: [
      { label: "Cell size", value: "About 15,000 m² (66 m edge)" },
      { label: "Cells", value: "About 42,000 across the pilot area" },
    ],
  },
];

const DERIVED: Dataset[] = [
  {
    icon: Gauge,
    kind: "Index",
    name: "Standardized Precipitation Index",
    source: "Computed by Zoryn from CHIRPS",
    role: "How unusual each cell's rainfall total is for the time of year, over three accumulation periods.",
    facts: [
      { label: "Series", value: "SPI-3, SPI-6, SPI-12" },
      { label: "Method", value: "WMO SPI" },
    ],
  },
];

function DatasetCard({ dataset, tone }: { dataset: Dataset; tone: "live" | "available" }) {
  const Icon = dataset.icon;

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#F2F2F2]">
          <Icon className="h-4 w-4 text-[#3A3A3A]" strokeWidth={1.75} aria-hidden="true" />
        </div>

        <Pill tone={tone}>{dataset.kind}</Pill>
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug text-[#1A1A1A]">
        {dataset.name}
      </h3>

      <p className="mt-1 text-xs text-[#6B6B6B]">{dataset.source}</p>

      <p className="mt-3 text-sm leading-6 text-[#3A3A3A]">{dataset.role}</p>

      <dl className="mt-4 divide-y divide-[#F0F0F0] border-t border-[#E5E5E5]">
        {dataset.facts.map((fact) => (
          <div
            key={fact.label}
            className="flex items-baseline justify-between gap-4 py-2.5"
          >
            <dt className="shrink-0 text-xs text-[#6B6B6B]">{fact.label}</dt>
            <dd className="text-right text-sm text-[#1A1A1A]">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

export default function DatasetsPage() {
  const health = useHealth();
  const timeline = useDiscoveryTimeline();

  const coverage = useMemo(() => {
    const months = [...(timeline.data ?? [])].sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp),
    );

    if (months.length === 0) {
      return null;
    }

    return {
      first: months[0].timestamp,
      last: months[months.length - 1].timestamp,
      months: months.length,
    };
  }, [timeline.data]);

  const failed = health.isError ? health : timeline.isError ? timeline : null;

  return (
    <PageShell>
      <PageHeader
        question="What is it built on?"
        title="Datasets"
        lede="The pilot reads one open rainfall record, turns it into a standard index, and keeps every step of the reasoning it produces."
      />

      <Container className="space-y-10 py-8 sm:space-y-14 sm:py-12">
        {/* ---------------------------------------------------- Inputs */}
        <section aria-labelledby="inputs-heading">
          <SectionHeading
            id="inputs-heading"
            eyebrow="Read by Zoryn"
            title="Source data"
            description="Open datasets the pilot takes as given."
          />

          <ul className="mt-5 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {INPUTS.map((dataset) => (
              <li key={dataset.name}>
                <DatasetCard dataset={dataset} tone="available" />
              </li>
            ))}
          </ul>
        </section>

        {/* --------------------------------------------------- Derived */}
        <section aria-labelledby="derived-heading">
          <SectionHeading
            id="derived-heading"
            eyebrow="Computed by Zoryn"
            title="Derived data"
            description="Calculated from the source data with a published method, so anyone can reproduce it."
          />

          <ul className="mt-5 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DERIVED.map((dataset) => (
              <li key={dataset.name}>
                <DatasetCard dataset={dataset} tone="available" />
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------- Knowledge */}
        <section aria-labelledby="knowledge-heading">
          <SectionHeading
            id="knowledge-heading"
            eyebrow="Produced by Zoryn"
            title="The knowledge dataset"
            description="What the reasoning engine writes: the evidence, patterns, hypotheses and discoveries behind everything shown in this application."
          />

          <Card className="mt-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#F2F2F2]">
                <Database className="h-4 w-4 text-[#3A3A3A]" strokeWidth={1.75} aria-hidden="true" />
              </div>

              <Pill tone="live">Live</Pill>
            </div>

            <ul className="mt-4 flex flex-wrap gap-2">
              {["Evidence", "Patterns", "Hypotheses", "Discoveries"].map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-[#E5E5E5] bg-[#F5F5F5] px-2.5 py-1 text-xs text-[#3A3A3A]"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-[#E5E5E5] pt-5">
              {failed ? (
                <ErrorState
                  error={failed.error}
                  subject="The live figures for the knowledge dataset"
                  onRetry={() => {
                    void health.refetch();
                    void timeline.refetch();
                  }}
                />
              ) : health.isLoading || timeline.isLoading ? (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="col-span-2 h-24 lg:col-span-1" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                  <StatTile
                    label="Discoveries held"
                    value={(health.data?.discoveries ?? 0).toLocaleString()}
                  />
                  <StatTile
                    label="Months with discoveries"
                    value={(coverage?.months ?? 0).toLocaleString()}
                  />
                  <div className="col-span-2 lg:col-span-1">
                    <StatTile
                      label="Discoveries span"
                      value={
                        coverage
                          ? `${formatMonthShort(coverage.first)} – ${formatMonthShort(coverage.last)}`
                          : "—"
                      }
                      hint="First to most recent discovery"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/knowledge-graph"
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1A1A1A] px-5 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                See how it connects
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </Link>

              <Link
                to="/status"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white px-5 text-sm font-semibold text-[#3A3A3A] transition-colors hover:bg-[#F2F2F2]"
              >
                System status
              </Link>
            </div>
          </Card>

          <div className="mt-4 rounded-xl border border-[#E5E5E5] bg-[#F5F5F5] p-4 sm:p-5">
            <MonoLabel>Flow</MonoLabel>
            <p className="mt-1.5 text-sm leading-6 text-[#3A3A3A]">
              CHIRPS rainfall, per grid cell and month, becomes the SPI series
              and the month-to-month evidence. Evidence becomes patterns,
              hypotheses and discoveries by the rules on the Rules page.
            </p>
          </div>
        </section>
      </Container>
    </PageShell>
  );
}
