import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowDown, ArrowRight, ChevronDown } from "lucide-react";

import {
  Card,
  Container,
  MonoLabel,
  PageHeader,
  PageShell,
  SectionHeading,
} from "@/components/page/PageShell";
import MonthPicker from "@/components/page/MonthPicker";
import {
  EmptyState,
  ErrorState,
  Skeleton,
} from "@/components/page/States";
import { useDiscoveryTimeline } from "@/hooks/useDiscoveries";
import {
  useDiscoveriesAt,
  usePatternEvidence,
  useReasoningAt,
} from "@/hooks/useKnowledge";
import { FONT_BODY, FONT_MONO } from "@/lib/fonts";
import type { Pattern } from "@/services/api/reasoning";
import { formatConfidence } from "@/utils/formatConfidence";
import { discoveryLink, shortH3 } from "@/utils/location";
import {
  formatMonth,
  formatMonthShort,
  formatPeriod,
  isMonthKey,
} from "@/utils/months";
import { humanize, plural } from "@/utils/text";
import { uniqueBy } from "@/utils/unique";

// "How is the knowledge connected?" - first the model every discovery
// follows, then one real discovery drawn as a graph: the evidence that
// supports each pattern, the patterns that support the hypothesis, and the
// discovery it became.
//
// Wide screens get a node-link diagram. Phones get the same graph as a
// nested outline, which stays readable at 320px where a diagram would not.

const MODEL = [
  { name: "Observation", text: "A measured value for a place and month." },
  { name: "Signature", text: "All observations for one place in one month." },
  { name: "Evidence", text: "A change between two consecutive signatures.", stored: true },
  { name: "Pattern", text: "Evidence that repeats in a recognised way.", stored: true },
  { name: "Hypothesis", text: "What the patterns suggest is happening.", stored: true },
  { name: "Discovery", text: "A hypothesis published with its confidence.", stored: true },
  { name: "Explanation", text: "Plain-language wording, written by AI afterwards." },
];

// A discovery can rest on dozens of runs; the diagram draws the longest few
// and counts the rest.
const SHOWN_PATTERNS = 6;
const LIST_SIZE = 25;

interface PatternNode {
  id: string;
  name: string;
  frequency: number;
  /** Distinct supporting months, oldest first; null while loading. */
  months: string[] | null;
  failed: boolean;
}

function wrap(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let line = "";

  for (const word of text.split(/\s+/)) {
    if (line && `${line} ${word}`.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }

  if (line) {
    lines.push(line);
  }

  if (lines.length > 2) {
    return [lines[0], `${lines[1]}…`];
  }

  return lines;
}

function evidenceTitle(node: PatternNode): string {
  if (node.failed) return "Evidence unavailable";
  if (!node.months) return "Loading…";
  if (node.months.length === 0) return "No evidence listed";

  return formatPeriod(node.months[0], node.months[node.months.length - 1]);
}

function evidenceSubtitle(node: PatternNode): string {
  if (!node.months || node.failed || node.months.length === 0) {
    return "";
  }

  return `${plural(node.months.length, "month")} of change`;
}

export default function KnowledgeGraphPage() {
  const [params, setParams] = useSearchParams();

  const timeline = useDiscoveryTimeline();
  const months = useMemo(
    () =>
      [...(timeline.data ?? [])].sort((a, b) =>
        a.timestamp.localeCompare(b.timestamp),
      ),
    [timeline.data],
  );

  const requestedMonth = params.get("date");
  const latest = months.length > 0 ? months[months.length - 1].timestamp : null;
  const month = isMonthKey(requestedMonth) ? requestedMonth : latest;

  const list = useDiscoveriesAt(month);
  const candidates = useMemo(
    () =>
      uniqueBy(list.data ?? [], (item) => item.h3_id)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, LIST_SIZE),
    [list.data],
  );

  const requestedH3 = params.get("h3");
  const h3Id = requestedH3 ?? candidates[0]?.h3_id ?? "";

  const reasoning = useReasoningAt(h3Id, month);
  const graph = reasoning.data;

  // Exact duplicate pattern records are merged before anything is counted.
  const patterns = useMemo<Pattern[]>(
    () => uniqueBy(graph?.patterns ?? [], (item) => item.id),
    [graph?.patterns],
  );

  const topPatterns = useMemo<Pattern[]>(
    () =>
      [...patterns]
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, SHOWN_PATTERNS),
    [patterns],
  );

  const evidenceQueries = usePatternEvidence(topPatterns.map((item) => item.id));

  const nodes: PatternNode[] = topPatterns.map((pattern, index) => {
    const query = evidenceQueries[index];

    return {
      id: pattern.id,
      name: humanize(pattern.name),
      frequency: pattern.frequency,
      months: query?.data
        ? [...new Set(query.data.map((item) => item.timestamp))].sort()
        : null,
      failed: Boolean(query?.isError),
    };
  });

  const hiddenPatterns = patterns.length - topPatterns.length;

  function select(next: { date?: string; h3?: string | null }) {
    const query: Record<string, string> = {};
    const date = next.date ?? month;

    if (date) {
      query.date = date;
    }

    if (next.h3) {
      query.h3 = next.h3;
    }

    setParams(query, { replace: true });
  }

  const discovery = graph?.discovery;
  const hypothesis = graph?.hypothesis;
  const hasGraph = Boolean(graph && graph.available !== false && discovery && hypothesis);

  const selectedInList = candidates.some((item) => item.h3_id === h3Id);

  return (
    <PageShell>
      <PageHeader
        question="How is the knowledge connected?"
        title="Knowledge Graph"
        lede="Every discovery is the end of a chain: observations become evidence, evidence forms patterns, patterns support a hypothesis. Here is the model, and one real discovery drawn through it."
      />

      <Container className="space-y-10 py-8 sm:space-y-14 sm:py-12">
        {/* ----------------------------------------------------- Model */}
        <section aria-labelledby="model-heading">
          <SectionHeading
            id="model-heading"
            eyebrow="The model"
            title="What links to what"
            description="Each step is supported by the one before it. The four marked steps are kept for every discovery, so any conclusion can be traced back."
          />

          <ol className="mt-5 flex flex-col gap-1 lg:flex-row lg:items-stretch lg:gap-0">
            {MODEL.map((step, index) => (
              <li
                key={step.name}
                className="flex flex-col items-stretch lg:flex-1 lg:flex-row lg:items-center"
              >
                <div
                  className={`flex-1 rounded-xl border px-4 py-3 lg:h-full lg:px-3 ${
                    step.stored
                      ? "border-[#1A1A1A] bg-white"
                      : "border-[#E5E5E5] bg-[#F5F5F5]"
                  }`}
                >
                  <p className="text-sm font-semibold text-[#1A1A1A]">
                    {step.name}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-[#6B6B6B]">
                    {step.text}
                  </p>
                </div>

                {index < MODEL.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="flex justify-center py-0.5 text-[#8A8A8A] lg:px-1 lg:py-0"
                  >
                    <ArrowDown className="h-4 w-4 lg:hidden" strokeWidth={1.75} />
                    <ArrowRight className="hidden h-4 w-4 lg:block" strokeWidth={1.75} />
                  </span>
                )}
              </li>
            ))}
          </ol>

          <p className="mt-3 flex items-center gap-2 text-xs text-[#6B6B6B]">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-[3px] border border-[#1A1A1A] bg-white"
            />
            Kept in the knowledge dataset for every discovery
          </p>
        </section>

        {/* -------------------------------------------------- Instance */}
        <section aria-labelledby="instance-heading">
          <SectionHeading
            id="instance-heading"
            eyebrow="One discovery"
            title="A real discovery as a graph"
            description="Choose a month and a location to see what its discovery rests on."
          />

          {timeline.isError ? (
            <div className="mt-5">
              <ErrorState
                error={timeline.error}
                subject="The discovery timeline"
                onRetry={() => void timeline.refetch()}
              />
            </div>
          ) : (
            <>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div>
                  <MonoLabel className="mb-1.5">Month</MonoLabel>

                  {timeline.isLoading ? (
                    <Skeleton className="h-11 w-full" />
                  ) : (
                    <MonthPicker
                      months={months}
                      value={month}
                      onChange={(date) => select({ date, h3: null })}
                    />
                  )}
                </div>

                <div>
                  <MonoLabel className="mb-1.5">Location</MonoLabel>

                  {list.isLoading || timeline.isLoading ? (
                    <Skeleton className="h-11 w-full" />
                  ) : (
                    <div className="relative">
                      <select
                        aria-label="Location"
                        value={h3Id}
                        disabled={candidates.length === 0 && !h3Id}
                        onChange={(event) => select({ h3: event.target.value })}
                        style={{ fontFamily: FONT_MONO }}
                        className="h-11 w-full appearance-none truncate rounded-lg border border-[#E5E5E5] bg-white pl-3 pr-9 text-base text-[#1A1A1A] outline-none focus-visible:border-[#1A1A1A] disabled:opacity-50 sm:text-sm"
                      >
                        {h3Id && !selectedInList && (
                          <option value={h3Id}>H3 {shortH3(h3Id)}</option>
                        )}

                        {candidates.map((item) => (
                          <option key={item.id} value={item.h3_id}>
                            H3 {shortH3(item.h3_id)} ·{" "}
                            {formatConfidence(item.confidence)}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  {(list.data?.length ?? 0) > LIST_SIZE && (
                    <p className="mt-1.5 text-xs text-[#6B6B6B]">
                      The {LIST_SIZE} highest-confidence locations of{" "}
                      {(list.data?.length ?? 0).toLocaleString()} this month.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                {list.isError ? (
                  <ErrorState
                    error={list.error}
                    subject="The discovery list"
                    onRetry={() => void list.refetch()}
                  />
                ) : reasoning.isError ? (
                  <ErrorState
                    error={reasoning.error}
                    subject="The reasoning for this location"
                    onRetry={() => void reasoning.refetch()}
                  />
                ) : timeline.isLoading ||
                  list.isLoading ||
                  (h3Id && reasoning.isLoading) ? (
                  <div role="status" aria-label="Loading the graph">
                    <Skeleton className="h-80 w-full" />
                  </div>
                ) : !h3Id ? (
                  <EmptyState title="No discovery to draw">
                    {month
                      ? `No supported environmental reasoning was produced for ${formatMonth(month)}.`
                      : "The knowledge dataset does not contain any discoveries."}
                  </EmptyState>
                ) : !hasGraph || !discovery || !hypothesis ? (
                  <EmptyState title="No environmental discovery">
                    No supported environmental reasoning was produced for this
                    location{month ? ` in ${formatMonth(month)}` : ""}.
                  </EmptyState>
                ) : (
                  <Card>
                    <div className="hidden sm:block">
                      <GraphDiagram
                        nodes={nodes}
                        hidden={hiddenPatterns}
                        hypothesis={hypothesis.name}
                        hypothesisConfidence={hypothesis.confidence}
                        discovery={discovery.name}
                        discoveryConfidence={discovery.confidence}
                      />
                    </div>

                    <div className="sm:hidden">
                      <GraphOutline
                        nodes={nodes}
                        hidden={hiddenPatterns}
                        hypothesis={hypothesis.name}
                        hypothesisConfidence={hypothesis.confidence}
                        discovery={discovery.name}
                        discoveryConfidence={discovery.confidence}
                      />
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-[#E5E5E5] pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm leading-6 text-[#6B6B6B]">
                        {plural(patterns.length, "pattern")}{" "}
                        {patterns.length === 1 ? "supports" : "support"} this
                        discovery
                        {hiddenPatterns > 0
                          ? `; the ${topPatterns.length} longest are drawn.`
                          : "."}
                      </p>

                      <Link
                        to={discoveryLink(h3Id, month)}
                        className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1A1A1A] px-5 text-sm font-semibold text-white transition-colors hover:bg-black"
                      >
                        Open the full reasoning
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </Card>
                )}
              </div>
            </>
          )}
        </section>
      </Container>
    </PageShell>
  );
}

interface GraphProps {
  nodes: PatternNode[];
  hidden: number;
  hypothesis: string;
  hypothesisConfidence: number;
  discovery: string;
  discoveryConfidence: number;
}

// ---------------------------------------------------------------------------
// Wide screens: layered node-link diagram, read left to right.
// ---------------------------------------------------------------------------

const NODE_H = 52;
const ROW_GAP = 14;
const HEADER_H = 26;
const EDGE = "#BDBDBD";

function GraphDiagram({
  nodes,
  hidden,
  hypothesis,
  hypothesisConfidence,
  discovery,
  discoveryConfidence,
}: GraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(880);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) {
        setWidth(Math.round(entry.contentRect.width));
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const rows = nodes.length + (hidden > 0 ? 1 : 0);
  const bodyH = Math.max(rows * NODE_H + (rows - 1) * ROW_GAP, NODE_H + 24);
  const height = HEADER_H + bodyH;

  const gap = Math.max(28, Math.round(width * 0.045));
  const nodeW = Math.floor((width - gap * 3) / 4);
  const columnX = [0, 1, 2, 3].map((index) => index * (nodeW + gap));
  const rowY = (index: number) => HEADER_H + index * (NODE_H + ROW_GAP);
  const midY = HEADER_H + bodyH / 2;
  const tallH = NODE_H + 24;
  const titleChars = Math.max(10, Math.floor((nodeW - 24) / 7.2));

  const columns = ["Evidence", "Pattern", "Hypothesis", "Discovery"];

  return (
    <div ref={containerRef}>
      <svg
        role="img"
        aria-label={`Graph of the discovery "${discovery}": ${nodes.length} drawn patterns with their evidence support the hypothesis "${hypothesis}".`}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="block max-w-full"
        style={{ fontFamily: FONT_BODY }}
      >
        <defs>
          <marker
            id="graph-arrow"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0 0 L8 4 L0 8 Z" fill={EDGE} />
          </marker>
        </defs>

        {columns.map((label, index) => (
          <text
            key={label}
            x={columnX[index]}
            y={12}
            fontSize="10"
            letterSpacing="1.6"
            fill="#6B6B6B"
            style={{ fontFamily: FONT_MONO, textTransform: "uppercase" }}
          >
            {label}
          </text>
        ))}

        {/* Edges are drawn first so the nodes sit on top of them. */}
        {nodes.map((node, index) => {
          const y = rowY(index) + NODE_H / 2;
          const fromPattern = columnX[1] + nodeW;
          const toHypothesis = columnX[2] - 2;
          const bend = (toHypothesis - fromPattern) / 2;

          return (
            <g key={`edges-${node.id}`} fill="none" stroke={EDGE} strokeWidth="1.5">
              <line
                x1={columnX[0] + nodeW}
                y1={y}
                x2={columnX[1] - 2}
                y2={y}
                markerEnd="url(#graph-arrow)"
              />
              <path
                d={`M ${fromPattern} ${y} C ${fromPattern + bend} ${y}, ${toHypothesis - bend} ${midY}, ${toHypothesis} ${midY}`}
                markerEnd="url(#graph-arrow)"
              />
            </g>
          );
        })}

        {hidden > 0 && (
          <path
            d={`M ${columnX[1] + nodeW} ${rowY(nodes.length) + NODE_H / 2} C ${columnX[1] + nodeW + (columnX[2] - columnX[1] - nodeW) / 2} ${rowY(nodes.length) + NODE_H / 2}, ${columnX[2] - (columnX[2] - columnX[1] - nodeW) / 2} ${midY}, ${columnX[2] - 2} ${midY}`}
            fill="none"
            stroke={EDGE}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        <line
          x1={columnX[2] + nodeW}
          y1={midY}
          x2={columnX[3] - 2}
          y2={midY}
          stroke={EDGE}
          strokeWidth="1.5"
          markerEnd="url(#graph-arrow)"
        />

        {nodes.map((node, index) => (
          <g key={node.id}>
            <DiagramNode
              x={columnX[0]}
              y={rowY(index)}
              width={nodeW}
              height={NODE_H}
              title={evidenceTitle(node)}
              subtitle={evidenceSubtitle(node)}
            />
            <DiagramNode
              x={columnX[1]}
              y={rowY(index)}
              width={nodeW}
              height={NODE_H}
              title={node.name}
              subtitle={`${plural(node.frequency, "month")} in a row`}
            />
          </g>
        ))}

        {hidden > 0 && (
          <DiagramNode
            x={columnX[1]}
            y={rowY(nodes.length)}
            width={nodeW}
            height={NODE_H}
            title={`${plural(hidden, "more pattern")}`}
            subtitle="Not drawn"
            dashed
          />
        )}

        <DiagramNode
          x={columnX[2]}
          y={midY - tallH / 2}
          width={nodeW}
          height={tallH}
          lines={wrap(hypothesis, titleChars)}
          subtitle={`${formatConfidence(hypothesisConfidence)} confidence`}
        />

        <DiagramNode
          x={columnX[3]}
          y={midY - tallH / 2}
          width={nodeW}
          height={tallH}
          lines={wrap(discovery, titleChars)}
          subtitle={`${formatConfidence(discoveryConfidence)} confidence`}
          strong
        />
      </svg>

      <p className="mt-3 text-xs text-[#6B6B6B]">
        Read left to right. Each arrow means "supports".
      </p>
    </div>
  );
}

function DiagramNode({
  x,
  y,
  width,
  height,
  title,
  lines,
  subtitle,
  dashed = false,
  strong = false,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  title?: string;
  lines?: string[];
  subtitle?: string;
  dashed?: boolean;
  strong?: boolean;
}) {
  const titleLines = lines ?? (title ? [title] : []);
  const lineCount = titleLines.length + (subtitle ? 1 : 0);
  const firstBaseline = y + height / 2 - ((lineCount - 1) * 16) / 2 + 4;

  return (
    <g>
      <rect
        x={x + 0.75}
        y={y + 0.75}
        width={width - 1.5}
        height={height - 1.5}
        rx="10"
        fill={strong ? "#1A1A1A" : "#FFFFFF"}
        stroke={strong ? "#1A1A1A" : dashed ? "#BDBDBD" : "#D4D4D4"}
        strokeWidth="1.5"
        strokeDasharray={dashed ? "4 4" : undefined}
      />

      {titleLines.map((line, index) => (
        <text
          key={line + index}
          x={x + 12}
          y={firstBaseline + index * 16}
          fontSize="12.5"
          fontWeight="600"
          fill={strong ? "#FFFFFF" : dashed ? "#5A5A5A" : "#1A1A1A"}
        >
          {line}
        </text>
      ))}

      {subtitle && (
        <text
          x={x + 12}
          y={firstBaseline + titleLines.length * 16}
          fontSize="11"
          fill={strong ? "#C9C9C9" : "#6B6B6B"}
        >
          {subtitle}
        </text>
      )}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Phones: the same graph as a nested outline, conclusion first.
// ---------------------------------------------------------------------------

function GraphOutline({
  nodes,
  hidden,
  hypothesis,
  hypothesisConfidence,
  discovery,
  discoveryConfidence,
}: GraphProps) {
  return (
    <div>
      <div className="rounded-xl bg-[#1A1A1A] px-4 py-3 text-white">
        <MonoLabel inverse>Discovery</MonoLabel>
        <p className="mt-1 text-[15px] font-semibold leading-snug">{discovery}</p>
        <p className="mt-0.5 text-xs text-[#C9C9C9]">
          {formatConfidence(discoveryConfidence)} confidence
        </p>
      </div>

      <div className="ml-4 border-l border-[#D4D4D4] pl-4 pt-3">
        <p className="mb-2 text-xs text-[#6B6B6B]">is supported by</p>

        <div className="rounded-xl border border-[#D4D4D4] bg-white px-4 py-3">
          <MonoLabel>Hypothesis</MonoLabel>
          <p className="mt-1 text-[15px] font-semibold leading-snug text-[#1A1A1A]">
            {hypothesis}
          </p>
          <p className="mt-0.5 text-xs text-[#6B6B6B]">
            {formatConfidence(hypothesisConfidence)} confidence
          </p>
        </div>

        <div className="ml-4 border-l border-[#D4D4D4] pl-4 pt-3">
          <p className="mb-2 text-xs text-[#6B6B6B]">is supported by</p>

          <ul className="space-y-2">
            {nodes.map((node) => (
              <li
                key={node.id}
                className="rounded-xl border border-[#D4D4D4] bg-white px-4 py-3"
              >
                <MonoLabel>Pattern</MonoLabel>
                <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">
                  {node.name}
                </p>
                <p className="mt-0.5 text-xs text-[#6B6B6B]">
                  {plural(node.frequency, "month")} in a row
                </p>

                <div className="mt-2.5 border-t border-[#F0F0F0] pt-2.5">
                  <MonoLabel>Evidence</MonoLabel>

                  {node.failed ? (
                    <p className="mt-1 text-xs text-[#6B6B6B]">
                      The evidence for this pattern could not be loaded.
                    </p>
                  ) : !node.months ? (
                    <Skeleton className="mt-1.5 h-6 w-40" />
                  ) : node.months.length === 0 ? (
                    <p className="mt-1 text-xs text-[#6B6B6B]">
                      No evidence listed.
                    </p>
                  ) : (
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {node.months.map((monthKey) => (
                        <li
                          key={monthKey}
                          className="rounded-md border border-[#E5E5E5] bg-[#F5F5F5] px-2 py-1 text-xs text-[#3A3A3A]"
                        >
                          {formatMonthShort(monthKey)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}

            {hidden > 0 && (
              <li className="rounded-xl border border-dashed border-[#BDBDBD] px-4 py-3 text-sm text-[#5A5A5A]">
                {plural(hidden, "more pattern")} not shown
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
