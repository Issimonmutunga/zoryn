import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import {
  Card,
  Container,
  MonoLabel,
  PageHeader,
  PageShell,
  Pill,
  SectionHeading,
} from "@/components/page/PageShell";
import { FONT_MONO } from "@/lib/fonts";

// "How does Zoryn decide?" - the deterministic rules, in the order the engine
// applies them. The wording mirrors the engine's own rule definitions
// (src/zoryn/knowledge and src/zoryn/indices); when a rule changes there,
// change it here.

type Rule = {
  stage: string;
  name: string;
  when: string;
  then: string;
  parameters: { label: string; value: string }[];
  standard?: string;
  note?: string;
};

const ACTIVE_RULES: Rule[] = [
  {
    stage: "Index",
    name: "Standardized Precipitation Index",
    when: "Monthly rainfall is available for a location.",
    then: "Rainfall is accumulated over 3, 6 and 12 months. For each calendar month a Gamma distribution is fitted to the accumulated totals, and every value is converted to a standard-normal score: SPI-3, SPI-6 and SPI-12.",
    parameters: [
      { label: "Accumulation", value: "3, 6 and 12 months" },
      { label: "Distribution", value: "Gamma, fitted separately for each calendar month" },
      { label: "Dry months", value: "The share of zero-rainfall totals is handled explicitly" },
    ],
    standard: "WMO SPI",
    note: "SPI describes each discovery and colours the map. The pattern rule below does not test SPI thresholds.",
  },
  {
    stage: "Evidence",
    name: "Month-to-month change",
    when: "A location's observed value differs from the previous month's.",
    then: "One evidence item is recorded for that month, with the direction of the change: increase or decrease.",
    parameters: [
      { label: "Compared", value: "Each month against the month before, per location and variable" },
      { label: "Change", value: "Any non-zero difference" },
      { label: "Strength", value: "1.0 when a change occurred, otherwise 0" },
    ],
    note: "In this version strength is all-or-nothing. It does not yet reflect how large the change was.",
  },
  {
    stage: "Pattern",
    name: "Persistent dryness",
    when: "The observed value decreases for at least 3 consecutive months at one location.",
    then: "A persistent dryness pattern is recorded covering that run of months.",
    parameters: [
      { label: "Minimum run", value: "3 consecutive months" },
      { label: "Frequency", value: "The number of months in the run" },
      { label: "Pattern confidence", value: "1.0 once the minimum run is met" },
    ],
    standard: "WMO SPI",
  },
  {
    stage: "Hypothesis",
    name: "Developing meteorological drought",
    when: "A location has one or more persistent dryness patterns.",
    then: "The hypothesis \"Developing Meteorological Drought\" is raised for that location, supported by those patterns.",
    parameters: [
      { label: "Confidence", value: "Months of persistent dryness divided by 12, capped at 100%" },
      { label: "Grouping", value: "Patterns of the same kind at the same location" },
    ],
  },
  {
    stage: "Discovery",
    name: "Publish the discovery",
    when: "A hypothesis has been raised.",
    then: "It is published as a discovery with the hypothesis's confidence, together with SPI-3, SPI-6 and SPI-12 for the last month of its evidence.",
    parameters: [
      { label: "Confidence", value: "Carried over unchanged from the hypothesis" },
      { label: "Dated to", value: "The last month of supporting evidence" },
    ],
  },
];

const INACTIVE_RULES: Rule[] = [
  {
    stage: "Pattern",
    name: "Consecutive change",
    when: "The observed value moves in the same direction, up or down, for at least 3 consecutive months.",
    then: "A persistent increase or persistent decrease pattern is recorded for that run.",
    parameters: [{ label: "Minimum run", value: "3 consecutive months" }],
  },
  {
    stage: "Pattern",
    name: "Frequency",
    when: "A variable accumulates at least 10 evidence items.",
    then: "A frequency pattern is recorded for that variable.",
    parameters: [
      { label: "Minimum support", value: "10 evidence items" },
      { label: "Pattern confidence", value: "Evidence count divided by 20, capped at 1.0" },
    ],
  },
];

function RuleCard({
  rule,
  index,
  active,
}: {
  rule: Rule;
  index?: number;
  active: boolean;
}) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {index !== undefined && (
            <span
              style={{ fontFamily: FONT_MONO }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#F2F2F2] text-[11px] text-[#3A3A3A]"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          )}

          <MonoLabel>{rule.stage}</MonoLabel>
        </div>

        <Pill tone={active ? "live" : "planned"}>
          {active ? "Active" : "Not active"}
        </Pill>
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-snug text-[#1A1A1A]">
        {rule.name}
      </h3>

      <dl className="mt-4 space-y-3">
        <div>
          <dt>
            <MonoLabel>When</MonoLabel>
          </dt>
          <dd className="mt-1 text-sm leading-6 text-[#3A3A3A]">{rule.when}</dd>
        </div>

        <div>
          <dt>
            <MonoLabel>Then</MonoLabel>
          </dt>
          <dd className="mt-1 text-sm leading-6 text-[#3A3A3A]">{rule.then}</dd>
        </div>
      </dl>

      <dl className="mt-4 divide-y divide-[#F0F0F0] border-t border-[#E5E5E5]">
        {rule.parameters.map((parameter) => (
          <div
            key={parameter.label}
            className="grid gap-0.5 py-2.5 sm:grid-cols-[9rem_1fr] sm:gap-4"
          >
            <dt className="text-xs text-[#6B6B6B] sm:text-sm">
              {parameter.label}
            </dt>
            <dd className="text-sm leading-6 text-[#1A1A1A]">
              {parameter.value}
            </dd>
          </div>
        ))}

        {rule.standard && (
          <div className="grid gap-0.5 py-2.5 sm:grid-cols-[9rem_1fr] sm:gap-4">
            <dt className="text-xs text-[#6B6B6B] sm:text-sm">Standard</dt>
            <dd className="text-sm leading-6 text-[#1A1A1A]">{rule.standard}</dd>
          </div>
        )}
      </dl>

      {rule.note && (
        <p className="mt-3 rounded-lg bg-[#F5F5F5] px-3 py-2.5 text-sm leading-6 text-[#5A5A5A]">
          {rule.note}
        </p>
      )}
    </Card>
  );
}

export default function RulesPage() {
  return (
    <PageShell>
      <PageHeader
        question="How does Zoryn decide?"
        title="Rules"
        lede="Every discovery is produced by fixed rules applied in a fixed order. The same observations always give the same discovery, and no model is involved until the optional explanation at the end."
      />

      <Container className="space-y-10 py-8 sm:space-y-14 sm:py-12">
        <section aria-labelledby="active-heading">
          <SectionHeading
            id="active-heading"
            eyebrow="Active in the pilot"
            title="From rainfall to a discovery, in five rules"
            description="Applied in this order for every location on the grid."
          />

          <ol className="mt-5 space-y-3 sm:space-y-4">
            {ACTIVE_RULES.map((rule, index) => (
              <li key={rule.name}>
                <RuleCard rule={rule} index={index} active />
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="inactive-heading">
          <SectionHeading
            id="inactive-heading"
            eyebrow="Built, not switched on"
            title="Rules available to the engine"
            description="These exist in the engine but the pilot does not run them, so they produce no patterns or discoveries today."
          />

          <ul className="mt-5 grid gap-3 sm:gap-4 md:grid-cols-2">
            {INACTIVE_RULES.map((rule) => (
              <li key={rule.name}>
                <RuleCard rule={rule} active={false} />
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="max-w-xl text-sm leading-6 text-[#5A5A5A]">
            See these rules applied to a real location: open any discovery to
            follow its evidence, patterns and hypothesis.
          </p>

          <Link
            to="/discoveries"
            className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1A1A1A] px-5 text-sm font-semibold text-white transition-colors hover:bg-black"
          >
            Browse discoveries
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </Link>
        </section>
      </Container>
    </PageShell>
  );
}
