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
  ShieldCheck,
  GitBranch,
  RefreshCw,
  BookOpenCheck,
  ScrollText,
} from "lucide-react";

// Fonts are loaded via <link> tags in index.html — see the note that
// accompanies this file. No next/font here since this is a Vite app.
const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', ui-monospace, monospace";

// ---------------------------------------------------------------------------
// Signature element: the same contour-line motif used across the site.
// ---------------------------------------------------------------------------
function Contours({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 400"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          d={`M -50 ${60 + i * 55} C 200 ${10 + i * 55}, 350 ${
            120 + i * 55
          }, 600 ${55 + i * 55} S 1000 ${10 + i * 55}, 1250 ${70 + i * 55}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity={0.5 - i * 0.06}
        />
      ))}
    </svg>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      style={{ fontFamily: FONT_MONO }}
      className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7C6A45]"
    >
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
    <main
      style={{ fontFamily: FONT_BODY }}
      className="bg-[#F3EEE2] text-[#2B2417]"
    >
      {/* ------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-[#D8CEB8]">
        <Contours className="pointer-events-none absolute inset-x-0 top-0 h-105 w-full text-[#39492F] opacity-[0.35]" />
        <div className="relative mx-auto max-w-287.5 px-8 pb-20 pt-24">
          <Eyebrow>Scientific Methodology</Eyebrow>
          <h1
            style={{ fontFamily: FONT_DISPLAY }}
            className="mt-5 max-w-3xl text-5xl font-medium leading-[1.08] tracking-tight text-[#241F14] md:text-6xl"
          >
            Scientific reasoning from observation to discovery.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#4A422F]">
            Zoryn does not ask a language model to determine environmental
            conditions. Every discovery is produced by a deterministic
            reasoning engine, built to be explainable at every step and
            reproducible from the original observations — not inferred by a
            model whose reasoning can't be inspected.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------- Core philosophy */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <Eyebrow>Core Philosophy</Eyebrow>
            <h2
              style={{ fontFamily: FONT_DISPLAY }}
              className="mt-4 text-3xl font-medium leading-tight text-[#241F14]"
            >
              Science decides.
              <br />
              AI explains.
            </h2>
          </div>
          <div className="max-w-xl space-y-4">
            {[
              "AI never determines whether a drought, or any other environmental condition, exists.",
              "Discoveries are produced entirely by deterministic scientific rules applied to evidence.",
              "AI is used exclusively to convert deterministic reasoning into natural language — never to alter it.",
            ].map((text) => (
              <div key={text} className="flex items-start gap-3 rounded-xl border border-[#D8CEB8] bg-[#FAF7EF] p-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#5B6B45]" strokeWidth={1.75} />
                <p className="text-sm leading-6 text-[#4A422F]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Reasoning pipeline */}
      <section
        id="reasoning-pipeline"
        className="border-y border-[#D8CEB8] bg-[#EDE6D3]"
      >
        <div className="mx-auto max-w-287.5 px-8 py-24">
          <Eyebrow>The Reasoning Pipeline</Eyebrow>
          <h2
            style={{ fontFamily: FONT_DISPLAY }}
            className="mt-4 max-w-lg text-3xl font-medium leading-tight text-[#241F14]"
          >
            Eight steps, and every one of them is visible.
          </h2>

          <div className="mt-14 flex flex-col gap-0 lg:flex-row lg:items-start lg:justify-between">
            {pipeline.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex flex-1 items-start lg:items-center">
                  <div className="flex flex-row items-start gap-4 py-5 lg:flex-col lg:items-center lg:gap-2 lg:py-0 lg:text-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D8CEB8] bg-[#FAF7EF]">
                      <Icon className="h-4 w-4 text-[#5B6B45]" strokeWidth={1.75} />
                    </div>
                    <div>
                      <span
                        style={{ fontFamily: FONT_MONO }}
                        className="text-[11px] text-[#8A7B5C]"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-base font-medium text-[#241F14]" style={{ fontFamily: FONT_DISPLAY }}>
                        {step.title}
                      </h3>
                      <p className="mt-1 max-w-40 text-xs leading-5 text-[#5A5240] lg:mx-auto lg:text-center">
                        {step.text}
                      </p>
                    </div>
                  </div>
                  {i < pipeline.length - 1 && (
                    <div className="mx-2 hidden h-px flex-1 self-center bg-[#C9BC98] lg:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Stage-by-stage */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <Eyebrow>What Happens at Each Stage</Eyebrow>
        <h2
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-4 max-w-xl text-3xl font-medium leading-tight text-[#241F14]"
        >
          Every transformation, laid out plainly.
        </h2>

        <div className="mt-10 space-y-3">
          {pipeline.map((step, i) => (
            <details
              key={step.title}
              className="group rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF] p-5 open:shadow-[0_8px_24px_rgba(43,36,23,0.06)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    style={{ fontFamily: FONT_MONO }}
                    className="text-[11px] text-[#8A7B5C]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-medium text-[#241F14]" style={{ fontFamily: FONT_DISPLAY }}>
                    {step.title}
                  </h3>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#8A7B5C] transition-transform group-open:rotate-90" strokeWidth={1.75} />
              </summary>

              <div className="mt-5 grid gap-4 border-t border-[#D8CEB8] pt-5 sm:grid-cols-2">
                <div>
                  <p style={{ fontFamily: FONT_MONO }} className="text-[10px] uppercase tracking-[0.16em] text-[#8A7B5C]">
                    Purpose
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[#4A422F]">{step.purpose}</p>
                </div>
                <div>
                  <p style={{ fontFamily: FONT_MONO }} className="text-[10px] uppercase tracking-[0.16em] text-[#8A7B5C]">
                    Input
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[#4A422F]">{step.input}</p>
                </div>
                <div>
                  <p style={{ fontFamily: FONT_MONO }} className="text-[10px] uppercase tracking-[0.16em] text-[#8A7B5C]">
                    Processing
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[#4A422F]">{step.processing}</p>
                </div>
                <div>
                  <p style={{ fontFamily: FONT_MONO }} className="text-[10px] uppercase tracking-[0.16em] text-[#8A7B5C]">
                    Output
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[#4A422F]">{step.output}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* --------------------------------------------- Principles behind the engine */}
      <section className="border-y border-[#D8CEB8] bg-[#EDE6D3]">
        <div className="mx-auto max-w-287.5 px-8 py-24">
          <Eyebrow>Principles Behind the Engine</Eyebrow>
          <h2
            style={{ fontFamily: FONT_DISPLAY }}
            className="mt-4 max-w-lg text-3xl font-medium leading-tight text-[#241F14]"
          >
            What every discovery has to satisfy.
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF] p-6">
                <Icon className="h-5 w-5 text-[#5B6B45]" strokeWidth={1.75} />
                <h3 style={{ fontFamily: FONT_DISPLAY }} className="mt-4 text-lg font-medium text-[#241F14]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5A5240]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Scientific standards */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <Eyebrow>Scientific Standards</Eyebrow>
        <h2
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-4 max-w-xl text-3xl font-medium leading-tight text-[#241F14]"
        >
          Zoryn doesn't invent rules. It applies recognised ones.
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5A5240]">
          The reasoning engine is built on internationally recognised
          environmental and data standards. Specific references and version
          details for each standard used in the current pilot will be
          published here.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {standards.map((standard) => (
            <div
              key={standard.code}
              className="flex flex-col gap-2 rounded-xl border border-dashed border-[#C9BC98] bg-[#FAF7EF] p-5"
            >
              <ScrollText className="h-4 w-4 text-[#8A7B5C]" strokeWidth={1.75} />
              <p style={{ fontFamily: FONT_MONO }} className="text-xs font-medium text-[#241F14]">
                {standard.code}
              </p>
              <p className="text-xs leading-5 text-[#5A5240]">{standard.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- Why it matters */}
      <section className="border-y border-[#D8CEB8] bg-[#241F14] text-[#F3EEE2]">
        <div className="mx-auto max-w-287.5 px-8 py-24">
          <Eyebrow>Why This Matters</Eyebrow>
          <h2
            style={{ fontFamily: FONT_DISPLAY }}
            className="mt-4 max-w-xl text-3xl font-medium leading-tight text-[#F3EEE2]"
          >
            You should be able to see how a conclusion was reached.
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
              <p style={{ fontFamily: FONT_MONO }} className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#B9AE8C]">
                Traditional AI
              </p>
              <ol className="mt-5 space-y-3">
                {["Observation", "Black box", "Prediction", "Unknown reasoning"].map((step, i) => (
                  <li key={step} className="flex items-center gap-3 text-sm text-[#D8CEB8]">
                    <span style={{ fontFamily: FONT_MONO }} className="text-[11px] text-[#8A7B5C]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-[#8AA06B]/40 bg-white/6 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
              <p style={{ fontFamily: FONT_MONO }} className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#B7C79A]">
                Zoryn
              </p>
              <ol className="mt-5 space-y-3">
                {["Observation", "Evidence", "Patterns", "Hypothesis", "Discovery", "Transparent explanation"].map((step, i) => (
                  <li key={step} className="flex items-center gap-3 text-sm text-[#F3EEE2]">
                    <span style={{ fontFamily: FONT_MONO }} className="text-[11px] text-[#B7C79A]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Closing */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <div className="rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF] p-10 text-center shadow-[0_1px_2px_rgba(43,36,23,0.04)] md:p-14">
          <h2
            style={{ fontFamily: FONT_DISPLAY }}
            className="text-3xl font-medium leading-tight text-[#241F14] md:text-4xl"
          >
            Environmental reasoning should always be understandable.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#5A5240]">
            Every environmental discovery Zoryn produces should be
            inspectable, reproducible and scientifically defensible — not
            just plausible-sounding.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#reasoning-pipeline"
              className="group flex items-center gap-2 rounded-lg bg-[#39492F] px-6 py-3 text-sm font-semibold text-[#F3EEE2] transition hover:bg-[#2E3B25]"
            >
              Explore the Reasoning Engine
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </a>

            <Link
              to="/explorer"
              className="rounded-lg border border-[#D8CEB8] bg-[#F3EEE2] px-6 py-3 text-sm font-semibold text-[#3A3221] transition hover:bg-[#EDE6D3]"
            >
              Open Explorer
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}