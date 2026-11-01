import { Link } from "react-router-dom";
import type { ElementType, ReactNode } from "react";
import {
  ArrowRight,
  Eye,
  Waves,
  Link2,
  FlaskConical,
  ListTree,
  Lightbulb,
  Sparkles,
  Compass,
  GitBranch,
  RefreshCw,
  BookOpenCheck,
  ScrollText,
} from "lucide-react";

// IBM Plex is self-hosted through the @fontsource imports in main.tsx;
// the family names are referenced directly here.
//
// UI pass: matched to the Homepage's palette and type treatment — moved
// off the cream/olive scheme to a soft grayscale black/white palette
// (near-black #1A1A1A on off-white #FAFAFA rather than pure black/white,
// to keep contrast comfortable), eased headings from font-black/tight
// tracking to font-semibold/normal tracking for smoother edges, and added
// `antialiased` at the root.
const FONT_BODY = "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', ui-monospace, monospace";

// Small uppercase kicker — softened to a mid-gray, semibold rather than
// bold, matching the Homepage's Eyebrow treatment.
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B6B6B]">
      {children}
    </p>
  );
}

// --------------------------------------------------------------- Pipeline data
type PipelineStep = {
  icon: ElementType;
  title: string;
  text: string;
  purpose: string;
  input: string;
  processing: string;
  output: string;
};

const pipeline: PipelineStep[] = [
  {
    icon: Eye,
    title: "Observation",
    text: "Authoritative datasets are collected and converted into standardized variables.",
    purpose: "Establish a common, verifiable starting point for reasoning.",
    input: "Authoritative environmental datasets.",
    processing: "Values are validated and converted into standardized units and formats.",
    output: "Standardized environmental observations.",
  },
  {
    icon: Waves,
    title: "Environmental Signature",
    text: "Observations are transformed into signatures representing measurable conditions.",
    purpose: "Describe measurable conditions rather than raw numbers.",
    input: "Standardized observations.",
    processing: "Observations are combined into indices such as SPI-3 over the relevant window.",
    output: "Environmental signatures.",
  },
  {
    icon: Link2,
    title: "Relationship",
    text: "A knowledge graph links observations, signatures and scientific rules.",
    purpose: "Connect signatures to the scientific rules that give them meaning.",
    input: "Environmental signatures.",
    processing: "Signatures are linked to deterministic rules in the knowledge graph.",
    output: "A structured set of environmental relationships.",
  },
  {
    icon: FlaskConical,
    title: "Evidence",
    text: "Each relationship contributes evidence for or against candidate hypotheses.",
    purpose: "Turn relationships into evidence that can be weighed.",
    input: "Environmental relationships.",
    processing: "Each relationship is evaluated for the support it lends to a hypothesis.",
    output: "Weighted evidence.",
  },
  {
    icon: ListTree,
    title: "Pattern",
    text: "Evidence is aggregated into repeatable environmental patterns.",
    purpose: "Identify recurring, recognisable states of the system.",
    input: "Weighted evidence.",
    processing: "Evidence is aggregated across the observation window into patterns.",
    output: "Detected environmental patterns.",
  },
  {
    icon: Lightbulb,
    title: "Hypothesis",
    text: "Patterns are evaluated against scientifically defined hypotheses.",
    purpose: "Narrow the field to the most probable explanation.",
    input: "Detected patterns.",
    processing: "Patterns are scored against predefined scientific hypotheses.",
    output: "A ranked candidate hypothesis.",
  },
  {
    icon: Sparkles,
    title: "Discovery",
    text: "A deterministic discovery is produced with confidence and supporting evidence.",
    purpose: "Reach a defensible, evidence-backed conclusion.",
    input: "The leading hypothesis.",
    processing: "The hypothesis is finalized against its supporting evidence and confidence is computed.",
    output: "A deterministic environmental discovery.",
  },
  {
    icon: Compass,
    title: "Decision",
    text: "The discovery is packaged with its evidence, ready to inform action.",
    purpose: "Hand off a conclusion someone can actually act on.",
    input: "The finalized discovery.",
    processing: "AI explains the discovery in plain language without altering it.",
    output: "A traceable, explainable basis for a decision.",
  },
];

// -------------------------------------------------------------- Principles data
type Principle = { icon: ElementType; title: string; text: string };

const principles: Principle[] = [
  { icon: GitBranch, title: "Deterministic", text: "The same observations always produce the same discovery." },
  { icon: Eye, title: "Transparent", text: "Every step of the reasoning is visible, not hidden inside a model." },
  { icon: ListTree, title: "Traceable", text: "A discovery can always be followed back to the evidence behind it." },
  { icon: RefreshCw, title: "Reproducible", text: "Results can be regenerated from the original observations at any time." },
  { icon: FlaskConical, title: "Evidence-Based", text: "Conclusions are built from evidence, never from assumption." },
  { icon: BookOpenCheck, title: "Standards Driven", text: "Reasoning applies recognised scientific standards, not invented rules." },
];

// -------------------------------------------------------------- Standards data
// Placeholders only, per methodology brief: names and general descriptions,
// no fabricated citations, document numbers, or specific usage claims.
type Standard = { code: string; name: string };

const standards: Standard[] = [
  { code: "WMO", name: "World Meteorological Organization" },
  { code: "IPCC", name: "Intergovernmental Panel on Climate Change" },
  { code: "CF Conventions", name: "Climate and Forecast metadata conventions" },
  { code: "ISO", name: "International Organization for Standardization" },
  { code: "SPI", name: "Standardized Precipitation Index methodology" },
];

export default function MethodologyPage() {
  return (
    <div
      style={{ fontFamily: FONT_BODY }}
      className="antialiased bg-[#FAFAFA] text-[#3A3A3A]"
    >
      {/* ------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-[#E5E5E5]">
        <div className="relative mx-auto max-w-287.5 px-4 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8 lg:pb-20 lg:pt-24">
          <Eyebrow>Scientific Methodology</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-[2rem] font-semibold uppercase leading-[1.08] tracking-normal [overflow-wrap:anywhere] sm:text-5xl text-[#1A1A1A] md:text-6xl">
            Science decides. AI explains.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8 text-[#5A5A5A]">
            Every discovery is produced by a deterministic reasoning engine,
            not inferred by a language model. AI is used only afterward, to
            put the finished, evidence-backed conclusion into plain language.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------- Reasoning pipeline */}
      <section
        id="reasoning-pipeline"
        className="border-y border-[#E5E5E5] bg-[#F2F2F2]"
      >
        <div className="mx-auto max-w-287.5 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <Eyebrow>The Reasoning Pipeline</Eyebrow>
          <h2 className="mt-4 max-w-lg text-2xl font-semibold uppercase leading-tight sm:text-3xl tracking-normal text-[#1A1A1A]">
            Eight steps, and every one of them is visible.
          </h2>

          <div className="mt-14 flex flex-col gap-0 lg:flex-row lg:items-start lg:justify-between">
            {pipeline.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex flex-1 items-start lg:items-center">
                  <div className="flex flex-row items-start gap-4 py-5 lg:flex-col lg:items-center lg:gap-2 lg:py-0 lg:text-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] bg-white">
                      <Icon className="h-4 w-4 text-[#6B6B6B]" strokeWidth={1.75} />
                    </div>
                    <div>
                      <span
                        style={{ fontFamily: FONT_MONO }}
                        className="text-[11px] font-medium text-[#6B6B6B]"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-base font-semibold uppercase tracking-normal text-[#1A1A1A]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-[#6B6B6B] lg:mx-auto lg:max-w-40 lg:text-center">
                        {step.text}
                      </p>
                    </div>
                  </div>
                  {i < pipeline.length - 1 && (
                    <div className="mx-2 hidden h-px flex-1 self-center bg-[#D9D9D9] lg:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Stage-by-stage */}
      <section className="mx-auto max-w-287.5 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Eyebrow>What Happens at Each Stage</Eyebrow>
        <h2 className="mt-4 max-w-xl text-2xl font-semibold uppercase leading-tight sm:text-3xl tracking-normal text-[#1A1A1A]">
          Every transformation, laid out plainly.
        </h2>

        <div className="mt-10 space-y-3">
          {pipeline.map((step, i) => (
            <details
              key={step.title}
              className="group rounded-2xl border border-[#E5E5E5] bg-white p-5 open:shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    style={{ fontFamily: FONT_MONO }}
                    className="text-[11px] font-medium text-[#6B6B6B]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-semibold uppercase tracking-normal text-[#1A1A1A]">
                    {step.title}
                  </h3>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#6B6B6B] transition-transform group-open:rotate-90" strokeWidth={1.75} />
              </summary>

              <div className="mt-5 grid gap-4 border-t border-[#E5E5E5] pt-5 sm:grid-cols-2">
                <div>
                  <p style={{ fontFamily: FONT_MONO }} className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B6B6B]">
                    Purpose
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[#3A3A3A]">{step.purpose}</p>
                </div>
                <div>
                  <p style={{ fontFamily: FONT_MONO }} className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B6B6B]">
                    Input
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[#3A3A3A]">{step.input}</p>
                </div>
                <div>
                  <p style={{ fontFamily: FONT_MONO }} className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B6B6B]">
                    Processing
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[#3A3A3A]">{step.processing}</p>
                </div>
                <div>
                  <p style={{ fontFamily: FONT_MONO }} className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B6B6B]">
                    Output
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[#3A3A3A]">{step.output}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* --------------------------------------------- Principles behind the engine */}
      <section className="border-y border-[#E5E5E5] bg-[#F2F2F2]">
        <div className="mx-auto max-w-287.5 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <Eyebrow>Principles Behind the Engine</Eyebrow>
          <h2 className="mt-4 max-w-lg text-2xl font-semibold uppercase leading-tight sm:text-3xl tracking-normal text-[#1A1A1A]">
            What every discovery has to satisfy.
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
                <Icon className="h-5 w-5 text-[#6B6B6B]" strokeWidth={1.75} />
                <h3 className="mt-4 text-lg font-semibold uppercase tracking-normal text-[#1A1A1A]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#6B6B6B]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Scientific standards */}
      <section className="mx-auto max-w-287.5 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Eyebrow>Scientific Standards</Eyebrow>
        <h2 className="mt-4 max-w-xl text-2xl font-semibold uppercase leading-tight sm:text-3xl tracking-normal text-[#1A1A1A]">
          Zoryn doesn't invent rules. It applies recognised ones.
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6B6B6B]">
          The reasoning engine is built on internationally recognised
          environmental and data standards. Specific references and version
          details for each standard used in the current pilot will be
          published here.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {standards.map((standard) => (
            <div
              key={standard.code}
              className="flex flex-col gap-2 rounded-xl border border-dashed border-[#CCCCCC] bg-white p-5"
            >
              <ScrollText className="h-4 w-4 text-[#6B6B6B]" strokeWidth={1.75} />
              <p style={{ fontFamily: FONT_MONO }} className="text-xs font-semibold text-[#1A1A1A]">
                {standard.code}
              </p>
              <p className="text-xs leading-5 text-[#6B6B6B]">{standard.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- Closing */}
      <section className="mx-auto max-w-287.5 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 text-center sm:p-10 shadow-[0_1px_2px_rgba(0,0,0,0.03)] md:p-14">
          <h2 className="text-2xl font-semibold uppercase leading-tight sm:text-3xl tracking-normal text-[#1A1A1A] md:text-4xl">
            Environmental reasoning should always be understandable.
          </h2>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#reasoning-pipeline"
              className="group flex items-center gap-2 rounded-lg bg-[#1A1A1A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              Explore the Reasoning Engine
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </a>

            <Link
              to="/explorer"
              className="rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-6 py-3 text-sm font-semibold text-[#3A3A3A] transition hover:bg-[#F2F2F2]"
            >
              Open Explorer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}