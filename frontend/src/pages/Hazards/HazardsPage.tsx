import { useMemo } from "react";
import type { ElementType } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CloudOff,
  Layers,
  Sprout,
  ThermometerSun,
  Waves,
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
import { formatMonthShort } from "@/utils/months";
import { SPI_CLASSES } from "@/utils/spi";

// "Which hazards does Zoryn reason about?" - one hazard is live in the pilot;
// the others are reserved in the design and clearly marked as not available,
// so nobody mistakes an empty map for "no flood risk".

type Hazard = {
  icon: ElementType;
  name: string;
  summary: string;
};

const PLANNED: Hazard[] = [
  {
    icon: Waves,
    name: "Flood",
    summary: "Water covering land that is normally dry, after intense or prolonged rainfall.",
  },
  {
    icon: ThermometerSun,
    name: "Extreme heat",
    summary: "Temperatures well above what is normal for the place and season, sustained over days.",
  },
  {
    icon: Sprout,
    name: "Vegetation stress",
    summary: "Plant cover that is less green or less productive than expected for the time of year.",
  },
  {
    icon: Layers,
    name: "Compound hazards",
    summary: "Two or more hazards occurring together or in sequence, such as heat during a drought.",
  },
];

const DROUGHT_FACTS = [
  { label: "Index", value: "Standardized Precipitation Index (SPI-3, SPI-6, SPI-12)" },
  { label: "Standard", value: "WMO SPI" },
  { label: "Observations", value: "CHIRPS monthly precipitation" },
  { label: "Area", value: "Nairobi, on an H3 grid (resolution 10)" },
];

export default function HazardsPage() {
  const timeline = useDiscoveryTimeline();

  const live = useMemo(() => {
    const months = [...(timeline.data ?? [])].sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp),
    );

    if (months.length === 0) {
      return null;
    }

    return {
      total: months.reduce((sum, item) => sum + item.discoveries, 0),
      months: months.length,
      latest: months[months.length - 1],
    };
  }, [timeline.data]);

  return (
    <PageShell>
      <PageHeader
        question="Which hazards does Zoryn reason about?"
        title="Hazards"
        lede="The pilot covers one hazard, meteorological drought. The others are part of the design but produce no discoveries yet."
      />

      <Container className="space-y-10 py-8 sm:space-y-14 sm:py-12">
        {/* ----------------------------------------------------- Live */}
        <section aria-labelledby="live-heading">
          <SectionHeading id="live-heading" eyebrow="Live in the pilot" title="Meteorological drought" />

          <Card className="mt-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#F2F2F2]">
                <CloudOff className="h-5 w-5 text-[#3A3A3A]" strokeWidth={1.75} aria-hidden="true" />
              </div>

              <Pill tone="live">Live in pilot</Pill>
            </div>

            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#3A3A3A]">
              A prolonged shortfall of rainfall compared with what is normal
              for the place and season. Zoryn raises a discovery where
              rainfall keeps falling month after month, and describes it with
              the Standardized Precipitation Index.
            </p>

            <dl className="mt-5 grid gap-x-8 gap-y-4 border-t border-[#E5E5E5] pt-5 sm:grid-cols-2">
              {DROUGHT_FACTS.map((fact) => (
                <div key={fact.label}>
                  <dt>
                    <MonoLabel>{fact.label}</MonoLabel>
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-[#1A1A1A]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 border-t border-[#E5E5E5] pt-5">
              {timeline.isError ? (
                <ErrorState
                  error={timeline.error}
                  subject="The live drought figures"
                  onRetry={() => void timeline.refetch()}
                />
              ) : live ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                  <StatTile
                    label="Drought discoveries"
                    value={live.total.toLocaleString()}
                    hint="Across the whole record"
                  />
                  <StatTile
                    label="Months with discoveries"
                    value={live.months.toLocaleString()}
                  />
                  <div className="col-span-2 lg:col-span-1">
                    <StatTile
                      label="Most recent"
                      value={formatMonthShort(live.latest.timestamp)}
                      hint={`${live.latest.discoveries.toLocaleString()} ${live.latest.discoveries === 1 ? "discovery" : "discoveries"}`}
                    />
                  </div>
                </div>
              ) : timeline.isLoading ? (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="col-span-2 h-24 lg:col-span-1" />
                </div>
              ) : (
                <p className="text-sm text-[#6B6B6B]">
                  The knowledge dataset contains no drought discoveries yet.
                </p>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/discoveries"
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1A1A1A] px-5 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                Browse discoveries
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </Link>

              <Link
                to="/rules"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white px-5 text-sm font-semibold text-[#3A3A3A] transition-colors hover:bg-[#F2F2F2]"
              >
                See the drought rules
              </Link>
            </div>
          </Card>
        </section>

        {/* --------------------------------------------- Classification */}
        <section aria-labelledby="classes-heading">
          <SectionHeading
            id="classes-heading"
            eyebrow="Severity"
            title="How drought severity is classified"
            description="SPI says how unusual a rainfall total is for that place and time of year. Zero is normal; values below -1 are drought classes. The same colours are used on the Explorer map."
          />

          <div className="mt-5 overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                WMO Standardized Precipitation Index classes
              </caption>

              <thead>
                <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
                  <th scope="col" className="px-4 py-2.5 font-normal sm:px-5">
                    <MonoLabel>Class</MonoLabel>
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-right font-normal sm:px-5">
                    <MonoLabel>SPI value</MonoLabel>
                  </th>
                </tr>
              </thead>

              <tbody>
                {SPI_CLASSES.map((item) => (
                  <tr
                    key={item.key}
                    className="border-b border-[#F0F0F0] last:border-b-0"
                  >
                    <th scope="row" className="px-4 py-3 font-normal sm:px-5">
                      <span className="flex items-center gap-3 text-[#1A1A1A]">
                        <span
                          aria-hidden="true"
                          className="h-3.5 w-3.5 shrink-0 rounded-sm border border-black/15"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.label}
                      </span>
                    </th>
                    <td className="px-4 py-3 text-right tabular-nums text-[#3A3A3A] sm:px-5">
                      {item.range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* -------------------------------------------------- Planned */}
        <section aria-labelledby="planned-heading">
          <SectionHeading
            id="planned-heading"
            eyebrow="Not yet available"
            title="Hazards reserved for later"
            description="These have no rules or data in the pilot. Zoryn makes no statement about them anywhere on the map."
          />

          <ul className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {PLANNED.map(({ icon: Icon, name, summary }) => (
              <li key={name}>
                <Card className="h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#F2F2F2]">
                      <Icon className="h-4 w-4 text-[#6B6B6B]" strokeWidth={1.75} aria-hidden="true" />
                    </div>

                    <Pill tone="planned">Planned</Pill>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-[#1A1A1A]">
                    {name}
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-[#6B6B6B]">
                    {summary}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </PageShell>
  );
}
