import { Link } from "react-router-dom";
import type { ElementType, ReactNode } from "react";
import {
  ArrowRight,
  ScanSearch,
  FlaskConical,
  ListTree,
  Compass,
} from "lucide-react";

// IBM Plex is self-hosted through the @fontsource imports in main.tsx;
// the family names are referenced directly here.
//
// Palette change: moved off the cream/olive scheme to a soft grayscale
// black/white palette — pure black/white avoided in favor of near-black
// (#1A1A1A) on off-white (#FAFAFA) to keep contrast comfortable rather
// than stark. Headings eased from font-black to font-semibold and
// tracking from tight to normal for a smoother, less jagged edge;
// `antialiased` added at the root for smoother font rendering overall.
const FONT_BODY = "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif";

// Small uppercase kicker — softened to a mid-gray, semibold rather than
// bold, so it reads as a quiet label rather than shouting.
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B6B6B]">
      {children}
    </p>
  );
}

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

export default function HomePage() {
  return (
    <div
      style={{ fontFamily: FONT_BODY }}
      className="antialiased bg-[#FAFAFA] text-[#3A3A3A]"
    >
      {/* ------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-[#E5E5E5]">
        <div className="relative mx-auto flex max-w-287.5 flex-col items-center px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24 text-center">
          <Eyebrow>Explainable Environmental Reasoning</Eyebrow>

          <h1 className="mt-6 max-w-3xl text-[2rem] font-semibold uppercase leading-[1.08] tracking-normal [overflow-wrap:anywhere] sm:text-5xl text-[#1A1A1A] md:text-6xl">
            From environmental signatures to trusted decisions.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8 text-[#5A5A5A]">
            Zoryn turns authoritative environmental observations into
            discoveries you can trace back, step by step, to the evidence
            behind them.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/explorer"
              className="group flex items-center gap-2 rounded-lg bg-[#1A1A1A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              Open Explorer
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </Link>

            <Link
              to="/methodology"
              className="rounded-lg border border-[#E5E5E5] bg-white px-6 py-3 text-sm font-semibold text-[#3A3A3A] transition hover:bg-[#F2F2F2]"
            >
              Explore Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- What it does */}
      <section className="mx-auto max-w-287.5 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Eyebrow>What Zoryn Does</Eyebrow>
        <h2 className="mt-4 max-w-xl text-2xl font-semibold uppercase leading-tight sm:text-3xl tracking-normal text-[#1A1A1A]">
          Four steps between raw data and a decision you can defend.
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whatItDoes.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
            >
              <Icon className="h-5 w-5 text-[#6B6B6B]" strokeWidth={1.75} />
              <h3 className="mt-4 text-lg font-semibold uppercase tracking-normal text-[#1A1A1A]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6B6B6B]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- Current pilot */}
      <section className="border-y border-[#E5E5E5] bg-[#1A1A1A] text-white">
        <div>
          <div className="relative mx-auto max-w-287.5 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24 text-center">
            <Eyebrow>Current Public Pilot</Eyebrow>
            <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-semibold uppercase leading-tight sm:text-3xl tracking-normal text-white md:text-4xl">
              Meteorological drought monitoring for Nairobi.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#C9C9C9]">
              The pilot applies the Standardized Precipitation Index (SPI-3)
              to monthly observations across Nairobi, with every discovery
              backed by explainable, traceable reasoning.
            </p>
            <Link
              to="/explorer"
              className="group mt-9 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#1A1A1A] transition hover:bg-[#F2F2F2]"
            >
              Open Pilot
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}