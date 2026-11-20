import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MapPinned,
  MessageSquareText,
  Share2,
} from "lucide-react";

import {
  Card,
  Container,
  Eyebrow,
  MonoLabel,
  PageShell,
  SectionHeading,
} from "@/components/page/PageShell";
import {
  ConfidenceBar,
  SpiChip,
  StatRow,
  StatTile,
} from "@/components/page/Figures";
import MonthGrid from "@/components/page/MonthGrid";
import {
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonRows,
} from "@/components/page/States";
import { useExplanationAt, useReasoningAt } from "@/hooks/useKnowledge";
import { FONT_MONO } from "@/lib/fonts";
import type { Evidence, Pattern } from "@/services/api/reasoning";
import { describeError } from "@/utils/apiError";
import { explorerLink, graphLink, shortH3 } from "@/utils/location";
import {
  formatDuration,
  formatMonth,
  formatMonthShort,
  formatPeriod,
  isMonthKey,
  monthSpan,
  parseMonth,
} from "@/utils/months";
import { classifySpi, formatSpi } from "@/utils/spi";
import { humanize, plural } from "@/utils/text";
import { uniqueBy } from "@/utils/unique";

// "What is happening here?" - one discovery on a page of its own, laid out in
// the order the specification fixes for every screen: answer, confidence,
// evidence, scientific basis, methodology. It can be linked to and shared,
// and reads top to bottom on a phone without the map.

// Validated single-hue mark colour for drying evidence (3:1 on white).
const EVIDENCE_COLOR = "#C76B29";

const EVIDENCE_PAGE = 12;

function uniqueEvidence(evidence: Evidence[]): Evidence[] {
  const seen = new Set<string>();
  const unique: Evidence[] = [];

  for (const item of evidence) {
    const key = `${item.timestamp}|${item.variable}|${item.direction}`;

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  return unique.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

/** "40 runs of 3 months, 8 runs of 4 months" */
function describeRuns(patterns: Pattern[]): string {
  const byLength = new Map<number, number>();

  for (const pattern of patterns) {
    byLength.set(pattern.frequency, (byLength.get(pattern.frequency) ?? 0) + 1);
  }

  return [...byLength.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(
      ([length, count]) =>
        `${plural(count, "run")} of ${plural(length, "month")}`,
    )
    .join(", ");
}

const actionPrimary =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1A1A1A] px-5 text-sm font-semibold text-white transition-colors hover:bg-black";

const actionSecondary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-5 text-sm font-semibold text-[#3A3A3A] transition-colors hover:bg-[#F2F2F2]";

export default function DiscoveryDetailPage() {
  const { h3Id = "" } = useParams();
  const [params] = useSearchParams();

  const requested = params.get("date");
  const month = isMonthKey(requested) ? requested : null;

  const reasoning = useReasoningAt(h3Id, month);

  const [explain, setExplain] = useState(false);
  const [showAllEvidence, setShowAllEvidence] = useState(false);

  const explanation = useExplanationAt(h3Id, month, explain);

  const graph = reasoning.data;
  const evidence = useMemo(
    () => uniqueEvidence(graph?.evidence ?? []),
    [graph?.evidence],
  );

  const backLink = month ? `/discoveries?date=${month}` : "/discoveries";

  const back = (
    <Link
      to={backLink}
      className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#5A5A5A] transition-colors hover:text-[#1A1A1A]"
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      {month ? `Discoveries, ${formatMonth(month)}` : "Discoveries"}
    </Link>
  );

  if (reasoning.isLoading) {
    return (
      <PageShell>
        <Container className="py-6 sm:py-10">
          {back}
          <Skeleton className="mt-6 h-10 w-3/4 max-w-xl" />
          <Skeleton className="mt-4 h-5 w-1/2 max-w-sm" />
          <div className="mt-8">
            <SkeletonRows rows={4} />
          </div>
        </Container>
      </PageShell>
    );
  }

  if (reasoning.isError) {
    return (
      <PageShell>
        <Container className="py-6 sm:py-10">
          {back}
          <div className="mt-6">
            <ErrorState
              error={reasoning.error}
              subject="The reasoning for this location"
              onRetry={() => void reasoning.refetch()}
            />
          </div>
        </Container>
      </PageShell>
    );
  }

  const discovery = graph?.discovery;
  const hypothesis = graph?.hypothesis;

  if (!graph || graph.available === false || !discovery || !hypothesis) {
    return (
      <PageShell>
        <Container className="py-6 sm:py-10">
          {back}
          <div className="mt-6">
            <EmptyState
              title="No environmental discovery"
              action={
                <Link to={backLink} className={actionSecondary}>
                  Back to discoveries
                </Link>
              }
            >
              No supported environmental reasoning was produced for this
              location{month ? ` in ${formatMonth(month)}` : ""}. Possible
              reasons: insufficient evidence, no recognised pattern, or no
              supported hypothesis.
            </EmptyState>
          </div>
        </Container>
      </PageShell>
    );
  }

  const patterns = uniqueBy(graph.patterns ?? [], (item) => item.id);
  const standard = patterns[0]?.standard ?? null;
  const patternNames = [...new Set(patterns.map((item) => humanize(item.name)))];

  const activeMonth = month ?? discovery.timestamp ?? discovery.end;
  const windowMonths = monthSpan(discovery.start, discovery.end);
  const spiClass = classifySpi(discovery.spi3);
  const spiIsDrought =
    typeof discovery.spi3 === "number" && discovery.spi3 <= -1;

  const evidenceMonths = new Set(evidence.map((item) => item.timestamp));
  const firstYear = parseMonth(evidence[0]?.timestamp)?.year;
  const lastYear = parseMonth(evidence[evidence.length - 1]?.timestamp)?.year;
  const years =
    firstYear !== undefined && lastYear !== undefined
      ? Array.from(
          { length: lastYear - firstYear + 1 },
          (_, index) => firstYear + index,
        )
      : [];

  const shownEvidence = showAllEvidence
    ? evidence
    : evidence.slice(-EVIDENCE_PAGE);

  const chain = [
    {
      step: "Evidence",
      title: plural(evidence.length, "month") + " of change",
      text: "Each is a month in which the observed value moved in one direction compared with the month before.",
    },
    {
      step: "Pattern",
      title:
        patternNames.length > 0
          ? `${patternNames.join(", ")}: ${describeRuns(patterns)}`
          : "No pattern recorded",
      text: "A pattern is recorded when the change continues for a minimum number of consecutive months.",
    },
    {
      step: "Hypothesis",
      title: hypothesis.name,
      text: "The patterns at this location support this explanation of what is happening.",
    },
    {
      step: "Discovery",
      title: discovery.name,
      text: "The hypothesis is published as a discovery with the confidence its evidence supports.",
    },
  ];

  return (
    <PageShell>
      {/* -------------------------------------------------------- Answer */}
      <header className="border-b border-[#E5E5E5]">
        <Container className="pb-8 pt-4 sm:pb-12 sm:pt-8">
          {back}

          <div className="mt-4 sm:mt-6">
            <Eyebrow>What is happening here?</Eyebrow>

            <h1 className="mt-3 max-w-3xl text-[1.75rem] font-semibold uppercase leading-[1.12] tracking-normal text-[#1A1A1A] sm:text-4xl md:text-5xl">
              {discovery.name}
            </h1>

            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#5A5A5A] sm:text-base">
              <span>{formatMonth(activeMonth)}</span>
              <span aria-hidden="true" className="text-[#CFCFCF]">
                /
              </span>
              <span style={{ fontFamily: FONT_MONO }} className="text-[13px]">
                H3 cell {shortH3(discovery.h3_id)}
              </span>
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to={explorerLink(discovery.h3_id, activeMonth)}
                className={actionPrimary}
              >
                <MapPinned className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                Open on map
              </Link>

              <Link
                to={graphLink(discovery.h3_id, activeMonth)}
                className={actionSecondary}
              >
                <Share2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                View as graph
              </Link>
            </div>
          </div>
        </Container>
      </header>

      <Container className="space-y-10 py-8 sm:space-y-14 sm:py-12">
        {/* ---------------------------------------------------- Confidence */}
        <section aria-labelledby="confidence-heading">
          <Card>
            <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:gap-10">
              <div>
                <MonoLabel>Confidence</MonoLabel>

                <h2
                  id="confidence-heading"
                  className="mt-2 text-3xl font-semibold leading-none text-[#1A1A1A]"
                >
                  {Math.round(discovery.confidence * 100)}%
                </h2>

                <div className="mt-4 max-w-sm">
                  <ConfidenceBar
                    value={discovery.confidence}
                    withLabel
                    showValue={false}
                  />
                </div>
              </div>

              <div className="text-sm leading-6 text-[#5A5A5A]">
                <p>
                  Confidence is set by a fixed rule from the amount of
                  supporting evidence. It is not a probability estimated by a
                  model.
                </p>

                {spiClass && !spiIsDrought && (
                  <p className="mt-3">
                    SPI-3 for this month is {formatSpi(discovery.spi3)} (
                    {spiClass.label.toLowerCase()}), which is not a drought
                    class. The discovery rests on the run of declining
                    rainfall below, not on the SPI class.
                  </p>
                )}

                <Link
                  to="/rules"
                  className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-medium text-[#1A1A1A] underline decoration-[#CFCFCF] underline-offset-4 hover:decoration-[#1A1A1A]"
                >
                  How the rules set confidence
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Card>

          <div className="mt-4">
            <StatRow>
              <StatTile
                label="SPI-3 (3-month)"
                value={formatSpi(discovery.spi3)}
                hint={<SpiChip value={discovery.spi3} showValue={false} />}
              />
              <StatTile
                label="SPI-6 (6-month)"
                value={formatSpi(discovery.spi6)}
                hint={<SpiChip value={discovery.spi6} showValue={false} />}
              />
              <StatTile
                label="SPI-12 (12-month)"
                value={formatSpi(discovery.spi12)}
                hint={<SpiChip value={discovery.spi12} showValue={false} />}
              />
              <StatTile
                label="Evidence window"
                value={formatDuration(windowMonths)}
                hint={formatPeriod(discovery.start, discovery.end)}
              />
            </StatRow>
          </div>
        </section>

        {/* ------------------------------------------------------ Evidence */}
        <section aria-labelledby="evidence-heading">
          <SectionHeading
            id="evidence-heading"
            eyebrow="Evidence"
            title="The months behind this discovery"
            description={
              evidence.length > 0
                ? `${plural(evidence.length, "month")} of evidence between ${formatMonthShort(evidence[0].timestamp)} and ${formatMonthShort(evidence[evidence.length - 1].timestamp)}. Each marked month is one in which the observed value changed from the month before.`
                : "No individual evidence items were returned for this discovery."
            }
          />

          {evidence.length > 0 && (
            <>
              <Card className="mt-5">
                <div className="mx-auto max-w-2xl">
                  <MonthGrid
                    caption="Months with supporting evidence"
                    years={years}
                    emptyLabel="no evidence recorded"
                    cell={(key) =>
                      evidenceMonths.has(key)
                        ? {
                            color: EVIDENCE_COLOR,
                            label: `${formatMonth(key)}: evidence of change`,
                          }
                        : null
                    }
                  />

                  <p className="mt-4 flex items-center gap-2 text-xs text-[#6B6B6B]">
                    <span
                      aria-hidden="true"
                      className="h-3 w-3 rounded-[3px]"
                      style={{ backgroundColor: EVIDENCE_COLOR }}
                    />
                    Month with supporting evidence
                  </p>
                </div>
              </Card>

              <div className="mt-4 overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    Evidence items supporting this discovery
                  </caption>

                  <thead>
                    <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
                      {["Month", "Observed", "Change", "Strength"].map(
                        (heading, index) => (
                          <th
                            key={heading}
                            scope="col"
                            className={`px-4 py-2.5 font-normal ${
                              index === 3 ? "text-right" : ""
                            } ${index === 1 ? "hidden sm:table-cell" : ""}`}
                          >
                            <MonoLabel>{heading}</MonoLabel>
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {shownEvidence.map((item) => (
                      <tr
                        key={`${item.timestamp}-${item.variable}-${item.direction}`}
                        className="border-b border-[#F0F0F0] last:border-b-0"
                      >
                        <td className="px-4 py-2.5 text-[#1A1A1A]">
                          {formatMonthShort(item.timestamp)}
                          <span className="block text-xs text-[#6B6B6B] sm:hidden">
                            {humanize(item.variable)}
                          </span>
                        </td>
                        <td className="hidden px-4 py-2.5 text-[#3A3A3A] sm:table-cell">
                          {humanize(item.variable)}
                        </td>
                        <td className="px-4 py-2.5 text-[#3A3A3A]">
                          {humanize(item.direction)}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-[#3A3A3A]">
                          {item.strength.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {evidence.length > EVIDENCE_PAGE && (
                  <button
                    type="button"
                    onClick={() => setShowAllEvidence((value) => !value)}
                    aria-expanded={showAllEvidence}
                    className="flex min-h-11 w-full items-center justify-center border-t border-[#E5E5E5] bg-[#FAFAFA] px-4 text-sm font-medium text-[#1A1A1A] hover:bg-[#F2F2F2]"
                  >
                    {showAllEvidence
                      ? `Show only the latest ${EVIDENCE_PAGE}`
                      : `Show all ${evidence.length.toLocaleString()} months`}
                  </button>
                )}
              </div>
            </>
          )}
        </section>

        {/* ----------------------------------------------- Scientific basis */}
        <section aria-labelledby="basis-heading">
          <SectionHeading
            id="basis-heading"
            eyebrow="Scientific basis"
            title="How the evidence became a discovery"
          />

          <ol className="mt-5 space-y-2">
            {chain.map((item, index) => (
              <li
                key={item.step}
                className="flex gap-4 rounded-xl border border-[#E5E5E5] bg-white p-4 sm:p-5"
              >
                <span
                  style={{ fontFamily: FONT_MONO }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#F2F2F2] text-[11px] text-[#3A3A3A]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <MonoLabel>{item.step}</MonoLabel>
                  <p className="mt-1 text-[15px] font-semibold leading-snug text-[#1A1A1A]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#6B6B6B]">
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[#E5E5E5] bg-[#F2F2F2] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <MonoLabel>Standard applied</MonoLabel>
              <p className="mt-1 text-[15px] font-semibold text-[#1A1A1A]">
                {standard ?? "Not recorded"}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link to="/rules" className={actionSecondary}>
                Rules
              </Link>
              <Link to="/methodology" className={actionSecondary}>
                Methodology
              </Link>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- Explanation */}
        <section aria-labelledby="explanation-heading">
          <SectionHeading
            id="explanation-heading"
            eyebrow="Explanation"
            title="In plain language"
            description="An AI-written explanation of the reasoning above. It is generated after the discovery exists and never changes it."
          />

          <div className="mt-5">
            {!explain ? (
              <button
                type="button"
                onClick={() => setExplain(true)}
                className={actionSecondary + " w-full sm:w-auto"}
              >
                <MessageSquareText className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                Generate explanation
              </button>
            ) : explanation.isLoading ? (
              <div role="status" aria-label="Generating explanation">
                <Skeleton className="h-28 w-full" />
              </div>
            ) : explanation.isError ? (
              <Card>
                <p className="text-[15px] font-semibold text-[#1A1A1A]">
                  The explanation could not be generated.
                </p>
                <p className="mt-1 text-sm leading-6 text-[#5A5A5A]">
                  {describeError(explanation.error, "The explanation").cause}{" "}
                  The discovery and its evidence above are unaffected.
                </p>
                <button
                  type="button"
                  onClick={() => void explanation.refetch()}
                  className={actionSecondary + " mt-4"}
                >
                  Try again
                </button>
              </Card>
            ) : explanation.data && explanation.data.available === false ? (
              <Card>
                <p className="text-[15px] font-semibold text-[#1A1A1A]">
                  No explanation is available.
                </p>
                <p className="mt-1 text-sm leading-6 text-[#5A5A5A]">
                  {explanation.data.summary ||
                    "The explanation service is not configured on this server."}
                </p>
              </Card>
            ) : explanation.data ? (
              <Card className="space-y-5">
                <div>
                  <MonoLabel>Summary</MonoLabel>
                  <p className="mt-1.5 text-[15px] leading-7 text-[#1A1A1A]">
                    {explanation.data.summary}
                  </p>
                </div>

                {explanation.data.interpretation && (
                  <div>
                    <MonoLabel>Interpretation</MonoLabel>
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-7 text-[#3A3A3A]">
                      {explanation.data.interpretation}
                    </p>
                  </div>
                )}

                {explanation.data.limitations.length > 0 && (
                  <div>
                    <MonoLabel>Limitations</MonoLabel>
                    <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-6 text-[#3A3A3A]">
                      {explanation.data.limitations.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {explanation.data.references.length > 0 && (
                  <div>
                    <MonoLabel>References</MonoLabel>
                    <ul className="mt-1.5 space-y-2 text-sm leading-6 text-[#3A3A3A]">
                      {explanation.data.references.map((reference) => (
                        <li key={`${reference.source}-${reference.title}`}>
                          <span className="font-medium text-[#1A1A1A]">
                            {reference.title}
                          </span>
                          <span className="text-[#6B6B6B]">
                            {" "}
                            ({reference.source}
                            {reference.section ? `, ${reference.section}` : ""})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {explanation.data.model && (
                  <p
                    style={{ fontFamily: FONT_MONO }}
                    className="border-t border-[#E5E5E5] pt-3 text-[11px] text-[#6B6B6B]"
                  >
                    Generated by {explanation.data.model}
                  </p>
                )}
              </Card>
            ) : null}
          </div>
        </section>
      </Container>
    </PageShell>
  );
}
