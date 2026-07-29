import { Link } from "react-router-dom";
import type { ElementType, ReactNode } from "react";
import {
  ArrowRight,
  Waves as WavesIcon,
  ScanSearch,
  FlaskConical,
  ListTree,
  Compass,
  ShieldCheck,
  Check,
  MapPinned,
} from "lucide-react";

// Fonts are loaded via <link> tags in index.html — see the note that
// accompanies this file. No next/font here since this is a Vite app.
const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', ui-monospace, monospace";

// ---------------------------------------------------------------------------
// Signature element: the same contour-line motif used on the About and
// Explorer pages, so the whole product shares one visual language.
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

const trustItems = [
  "Deterministic Reasoning",
  "Explainable AI",
  "Scientific Standards",
  "Environmental Evidence",
  "H3 Spatial Intelligence",
];

type FeatureCard = { icon: ElementType; title: string; text: string };

const whatItDoes: FeatureCard[] = [
  {
    icon: ScanSearch,
    title: "Environmental Discovery",
    text: "Authoritative observations are converted into structured environmental signatures the system can reason over.",
  },
  {
    icon: ListTree,
    title: "Explainable Reasoning",
    text: "Every conclusion is built through a visible chain of evidence, never inferred silently by a model.",
  },
  {
    icon: FlaskConical,
    title: "Scientific Traceability",
    text: "Discoveries expose the standards, patterns and evidence that produced them, ready for scrutiny.",
  },
  {
    icon: Compass,
    title: "Decision Support",
    text: "Outputs are structured for planners, researchers and decision-makers, not just for analysts.",
  },
];

const traditionalFlow = ["Observation", "Analysis", "Interpretation", "Decision"];
const zorynFlow = [
  "Observation",
  "Environmental Signature",
  "Evidence",
  "Pattern",
  "Hypothesis",
  "Discovery",
  "Decision",
];

const previewTabs = ["Explorer", "Reasoning", "Evidence", "AI Explanation", "Timeline"];

export default function HomePage() {
  return (
    <main
      style={{ fontFamily: FONT_BODY }}
      className="bg-[#F3EEE2] text-[#2B2417]"
    >
      {/* ------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-[#D8CEB8]">
        <Contours className="pointer-events-none absolute inset-x-0 top-0 h-105 w-full text-[#39492F] opacity-[0.35]" />
        <div className="relative mx-auto flex max-w-287.5 flex-col items-center px-8 pb-24 pt-24 text-center">
          <Eyebrow>Explainable Environmental Reasoning</Eyebrow>

          <h1
            style={{ fontFamily: FONT_DISPLAY }}
            className="mt-6 max-w-3xl text-5xl font-medium leading-[1.08] tracking-tight text-[#241F14] md:text-6xl"
          >
            From environmental signatures to trusted decisions.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#4A422F]">
            Zoryn transforms authoritative environmental observations into
            explainable discoveries using deterministic scientific reasoning.
            Every conclusion is transparent, traceable and supported by
            evidence before artificial intelligence explains it.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/explorer"
              className="group flex items-center gap-2 rounded-lg bg-[#39492F] px-6 py-3 text-sm font-semibold text-[#F3EEE2] transition hover:bg-[#2E3B25]"
            >
              Open Explorer
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </Link>

            <Link
              to="/methodology"
              className="rounded-lg border border-[#D8CEB8] bg-[#FAF7EF] px-6 py-3 text-sm font-semibold text-[#3A3221] transition hover:bg-[#EDE6D3]"
            >
              Explore Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Trust strip */}
      <section className="border-b border-[#D8CEB8] bg-[#EDE6D3]">
        <div className="mx-auto flex max-w-287.5 flex-wrap items-center justify-center gap-x-10 gap-y-4 px-8 py-6">
          {trustItems.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-[#4A422F]">
              <Check className="h-4 w-4 shrink-0 text-[#7C6A45]" strokeWidth={1.75} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- What it does */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <Eyebrow>What Zoryn Does</Eyebrow>
        <h2
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-4 max-w-xl text-3xl font-medium leading-tight text-[#241F14]"
        >
          Four steps between raw data and a decision you can defend.
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whatItDoes.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF] p-6 shadow-[0_1px_2px_rgba(43,36,23,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(43,36,23,0.08)]"
            >
              <Icon className="h-5 w-5 text-[#5B6B45]" strokeWidth={1.75} />
              <h3
                style={{ fontFamily: FONT_DISPLAY }}
                className="mt-4 text-lg font-medium text-[#241F14]"
              >
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#5A5240]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- Why it's different */}
      <section className="border-y border-[#D8CEB8] bg-[#EDE6D3]">
        <div className="mx-auto max-w-287.5 px-8 py-24">
          <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <div>
              <Eyebrow>Why It's Different</Eyebrow>
              <h2
                style={{ fontFamily: FONT_DISPLAY }}
                className="mt-4 text-3xl font-medium leading-tight text-[#241F14]"
              >
                Most tools stop at interpretation. Zoryn keeps going.
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#5A5240]">
                A shorter reasoning chain means more room for assumption.
                Zoryn adds the steps that make a conclusion defensible.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#D8CEB8] bg-[#F3EEE2] p-6">
                <p
                  style={{ fontFamily: FONT_MONO }}
                  className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8A7B5C]"
                >
                  Traditional Workflow
                </p>
                <ol className="mt-5 space-y-3">
                  {traditionalFlow.map((step, i) => (
                    <li key={step} className="flex items-center gap-3 text-sm text-[#4A422F]">
                      <span
                        style={{ fontFamily: FONT_MONO }}
                        className="text-[11px] text-[#8A7B5C]"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-[#5B6B45]/30 bg-[#FAF7EF] p-6 shadow-[0_8px_24px_rgba(43,36,23,0.06)]">
                <p
                  style={{ fontFamily: FONT_MONO }}
                  className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5B6B45]"
                >
                  Zoryn
                </p>
                <ol className="mt-5 space-y-3">
                  {zorynFlow.map((step, i) => (
                    <li key={step} className="flex items-center gap-3 text-sm text-[#241F14]">
                      <span
                        style={{ fontFamily: FONT_MONO }}
                        className="text-[11px] text-[#5B6B45]"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Platform preview */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <Eyebrow>See It In Action</Eyebrow>
        <h2
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-4 max-w-lg text-3xl font-medium leading-tight text-[#241F14]"
        >
          The reasoning is visible at every step.
        </h2>

        {/*
          Clearly-marked placeholder — intentionally not a hardcoded
          screenshot. Swap the contents of this frame for a real product
          capture (or an embedded live preview) when one is available.
        */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF] shadow-[0_1px_2px_rgba(43,36,23,0.04)]">
          <div className="flex flex-wrap gap-1 border-b border-[#D8CEB8] bg-[#EDE6D3] p-2">
            {previewTabs.map((tab, i) => (
              <span
                key={tab}
                style={{ fontFamily: FONT_MONO }}
                className={`rounded-md px-3 py-1.5 text-xs ${
                  i === 0 ? "bg-[#FAF7EF] text-[#241F14]" : "text-[#7C6A45]"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>

          <div className="flex min-h-70 flex-col items-center justify-center gap-3 border-2 border-dashed border-[#D8CEB8] p-10 text-center">
            <MapPinned className="h-6 w-6 text-[#8A7B5C]" strokeWidth={1.5} />
            <p className="text-sm font-medium text-[#4A422F]">Platform preview</p>
            <p className="max-w-sm text-xs leading-5 text-[#8A7B5C]">
              A real capture of the Explorer, reasoning chain and evidence
              view goes here once one is ready to publish.
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Current pilot */}
      <section className="border-y border-[#D8CEB8] bg-[#241F14] text-[#F3EEE2]">
        <div className="relative overflow-hidden">
          <Contours className="pointer-events-none absolute inset-x-0 bottom-0 h-70 w-full rotate-180 text-[#F3EEE2] opacity-[0.06]" />
          <div className="relative mx-auto max-w-287.5 px-8 py-24 text-center">
            <Eyebrow>Current Public Pilot</Eyebrow>
            <h2
              style={{ fontFamily: FONT_DISPLAY }}
              className="mx-auto mt-4 max-w-2xl text-3xl font-medium leading-tight text-[#F3EEE2] md:text-4xl"
            >
              Meteorological drought monitoring for Nairobi.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#D8CEB8]">
              The pilot applies the Standardized Precipitation Index (SPI-3)
              to monthly observations across Nairobi, with every discovery
              backed by explainable, traceable reasoning.
            </p>
            <Link
              to="/explorer"
              className="group mt-9 inline-flex items-center gap-2 rounded-lg bg-[#F3EEE2] px-6 py-3 text-sm font-semibold text-[#241F14] transition hover:bg-[#EDE6D3]"
            >
              Open Pilot
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------- Scientific philosophy */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <div className="rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF] p-10 text-center shadow-[0_1px_2px_rgba(43,36,23,0.04)] md:p-14">
          <ShieldCheck className="mx-auto h-6 w-6 text-[#5B6B45]" strokeWidth={1.5} />
          <h2
            style={{ fontFamily: FONT_DISPLAY }}
            className="mt-5 text-3xl font-medium leading-tight text-[#241F14] md:text-4xl"
          >
            Scientific first. AI second.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#5A5240]">
            Environmental discoveries are produced entirely by deterministic
            reasoning. Artificial intelligence never changes a conclusion and
            never invents evidence — it is used exclusively to explain, in
            natural language, what the reasoning already found.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------------- CTA */}
      <section className="border-t border-[#D8CEB8] bg-[#EDE6D3]">
        <div className="mx-auto flex max-w-287.5 flex-col items-center px-8 py-24 text-center">
          <WavesIcon className="h-6 w-6 text-[#7C6A45]" strokeWidth={1.5} />
          <h2
            style={{ fontFamily: FONT_DISPLAY }}
            className="mt-5 max-w-xl text-3xl font-medium leading-tight text-[#241F14] md:text-4xl"
          >
            Ready to explore environmental intelligence?
          </h2>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/explorer"
              className="group flex items-center gap-2 rounded-lg bg-[#39492F] px-6 py-3 text-sm font-semibold text-[#F3EEE2] transition hover:bg-[#2E3B25]"
            >
              Open Explorer
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </Link>

            <Link
              to="/methodology"
              className="rounded-lg border border-[#D8CEB8] bg-[#FAF7EF] px-6 py-3 text-sm font-semibold text-[#3A3221] transition hover:bg-[#F3EEE2]"
            >
              Methodology
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}