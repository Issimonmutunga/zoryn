import type { ReactNode, ElementType } from "react";
import {
  Eye,
  FlaskConical,
  Waves,
  Compass,
  ShieldCheck,
  SearchCheck,
  RefreshCw,
  Droplets,
  Globe2,
  Map as MapIcon,
  ShieldAlert,
  Microscope,
  AlertTriangle,
  Droplet,
  LifeBuoy,
} from "lucide-react";

// Fonts are loaded via <link> tags in index.html (see the snippet in the
// accompanying note) — Vite has no next/font equivalent, so we reference
// the family names directly here.
const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY =
  "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', ui-monospace, monospace";

type Application = {
  icon: ElementType;
  title: string;
  text: string;
};

const applications: Application[] = [
  { icon: Droplets, title: "Drought Monitoring", text: "Track meteorological drought severity as it develops." },
  { icon: Globe2, title: "Climate Intelligence", text: "Understand long-term shifts in environmental conditions." },
  { icon: MapIcon, title: "Environmental Planning", text: "Ground land and resource planning in current conditions." },
  { icon: ShieldAlert, title: "Risk Assessment", text: "Quantify environmental risk with traceable evidence." },
  { icon: Microscope, title: "Research", text: "Reproducible signatures for scientific investigation." },
  { icon: AlertTriangle, title: "Early Warning", text: "Surface emerging conditions before they escalate." },
  { icon: Droplet, title: "Water Security", text: "Monitor water availability against historical baselines." },
  { icon: LifeBuoy, title: "Disaster Preparedness", text: "Give responders lead time grounded in evidence." },
];

type TechGroup = {
  group: string;
  items: string[];
};

const techStack: TechGroup[] = [
  { group: "Backend", items: ["FastAPI", "Python", "Polars", "Deterministic Reasoning Engine"] },
  { group: "Frontend", items: ["React", "TypeScript", "MapLibre GL", "Tailwind CSS"] },
  { group: "Data", items: ["CHIRPS", "H3", "GeoParquet", "SPI"] },
  { group: "AI Explanation", items: ["Groq-hosted LLMs", "Reasoning Engine", "Evidence Graph"] },
];

// ---------------------------------------------------------------------------
// Signature element: a contour-line motif (elevation / isopleth lines), the
// same visual language used to render environmental fields like SPI or
// drought severity. Used sparingly as a hero backdrop and section divider.
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

function Divider() {
  return (
    <div className="relative h-px w-full bg-[#D8CEB8]">
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8A7B5C]" />
    </div>
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

export default function AboutPage() {
  return (
    <main
      style={{ fontFamily: FONT_BODY }}
      className="bg-[#F3EEE2] text-[#2B2417]"
    >
      {/* ------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-[#D8CEB8]">
        <Contours className="pointer-events-none absolute inset-x-0 top-0 h-105 w-full text-[#39492F] opacity-[0.35]" />
        <div className="relative mx-auto max-w-287.5 px-8 pb-24 pt-28">
          <Eyebrow>About Zoryn</Eyebrow>
          <h1
            style={{ fontFamily: FONT_DISPLAY }} className={`mt-5 max-w-3xl text-5xl font-medium leading-[1.08] tracking-tight text-[#241F14] md:text-6xl`}
          >
            Turning environmental data into trusted decisions.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#4A422F]">
            Zoryn is an environmental intelligence platform built to close the
            gap between raw environmental observation and confident action.
            It reads authoritative environmental data, reasons over it using
            deterministic, scientifically grounded methods, and surfaces
            discoveries that planners, researchers and decision-makers can
            trust — because every conclusion carries its own evidence.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- Mission */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div>
            <Eyebrow>Our Mission</Eyebrow>
            <h2
              style={{ fontFamily: FONT_DISPLAY }} className={`mt-4 text-3xl font-medium leading-tight text-[#241F14]`}
            >
              Observation is abundant.
              <br />
              Understanding is not.
            </h2>
          </div>
          <div className="max-w-xl">
            <p className="text-base leading-8 text-[#4A422F]">
              Satellites, rain gauges and reanalysis models now produce more
              environmental data than any team can manually interpret. The
              bottleneck was never observation — it was turning that data
              into something a decision-maker can act on with confidence.
            </p>
            <p className="mt-5 text-base leading-8 text-[#4A422F]">
              Zoryn bridges that gap. It applies deterministic reasoning,
              grounded in recognised scientific standards, to transform
              environmental signatures into explainable discoveries — each
              one traceable back to the observations and evidence that
              produced it.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-287.5 px-8">
        <Divider />
      </div>

      {/* ---------------------------------------------- What makes it different */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <Eyebrow>What Makes Zoryn Different</Eyebrow>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Eye,
              title: "Explainable",
              text: "Every discovery can be traced back to the environmental evidence that supports it.",
            },
            {
              icon: FlaskConical,
              title: "Evidence-Driven",
              text: "Reasoning is built only from authoritative environmental observations, never assumptions.",
            },
            {
              icon: Waves,
              title: "Signature-Based",
              text: "Environmental signatures reveal meaningful patterns before they become obvious.",
            },
            {
              icon: Compass,
              title: "Decision-Ready",
              text: "Outputs are structured for planners, researchers and decision-makers, not just analysts.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF] p-6 shadow-[0_1px_2px_rgba(43,36,23,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(43,36,23,0.08)]"
            >
              <Icon className="h-5 w-5 text-[#5B6B45]" strokeWidth={1.75} />
              <h3
                style={{ fontFamily: FONT_DISPLAY }} className={`mt-4 text-lg font-medium text-[#241F14]`}
              >
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#5A5240]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- How it works */}
      <section className="border-y border-[#D8CEB8] bg-[#EDE6D3]">
        <div className="mx-auto max-w-287.5 px-8 py-24">
          <Eyebrow>How Zoryn Works</Eyebrow>
          <h2
            style={{ fontFamily: FONT_DISPLAY }} className={`mt-4 max-w-lg text-3xl font-medium leading-tight text-[#241F14]`}
          >
            From observation to decision, every step is visible.
          </h2>

          <div className="mt-14 flex flex-col gap-0 md:flex-row md:items-start md:justify-between">
            {[
              ["Observation", "Authoritative environmental data enters the system."],
              ["Signature", "Raw observations are converted into structured environmental signatures."],
              ["Evidence", "Signatures are checked against scientific standards to form evidence."],
              ["Pattern", "Evidence is compared against known environmental patterns."],
              ["Hypothesis", "Candidate explanations are formed from matching patterns."],
              ["Discovery", "A hypothesis that holds under scrutiny becomes a discovery."],
              ["Decision", "Discoveries are packaged with their evidence, ready to act on."],
            ].map(([title, text], i, arr) => (
              <div key={title} className="flex flex-1 items-start md:items-center">
                <div className="flex flex-col items-start gap-2 py-4 md:items-center md:py-0 md:text-center">
                  <span
                    style={{ fontFamily: FONT_MONO }} className={`text-[11px] text-[#8A7B5C]`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 style={{ fontFamily: FONT_DISPLAY }} className="text-base font-medium text-[#241F14]">
                    {title}
                  </h3>
                  <p className="max-w-38 text-xs leading-5 text-[#5A5240] md:text-center">
                    {text}
                  </p>
                </div>
                {i < arr.length - 1 && (
                  <div className="mx-2 hidden h-px flex-1 self-center bg-[#C9BC98] md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Core principles */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <Eyebrow>Core Principles</Eyebrow>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Scientific Integrity",
              text: "Built on authoritative datasets and methods that hold up to scrutiny.",
            },
            {
              icon: SearchCheck,
              title: "Explainability",
              text: "Every conclusion can be inspected down to the evidence behind it.",
            },
            {
              icon: RefreshCw,
              title: "Reproducibility",
              text: "Results can always be reproduced from the original observations.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF] p-7"
            >
              <Icon className="h-5 w-5 text-[#7C6A45]" strokeWidth={1.75} />
              <h3 style={{ fontFamily: FONT_DISPLAY }} className="mt-4 text-lg font-medium text-[#241F14]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#5A5240]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-287.5 px-8">
        <Divider />
      </div>

      {/* ---------------------------------------------------------- Applications */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <Eyebrow>Applications</Eyebrow>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {applications.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF] p-6"
            >
              <Icon className="h-5 w-5 text-[#5B6B45]" strokeWidth={1.75} />
              <h3 style={{ fontFamily: FONT_DISPLAY }} className="mt-4 text-base font-medium text-[#241F14]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#5A5240]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- Technology stack */}
      <section className="border-y border-[#D8CEB8] bg-[#EDE6D3]">
        <div className="mx-auto max-w-287.5 px-8 py-24">
          <Eyebrow>Technology</Eyebrow>
          <div className="mt-10 grid gap-10 md:grid-cols-4">
            {techStack.map(({ group, items }) => (
              <div key={group}>
                <h3 style={{ fontFamily: FONT_DISPLAY }} className="text-sm font-medium text-[#241F14]">
                  {group}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      style={{ fontFamily: FONT_MONO }} className="rounded-md border border-[#D8CEB8] bg-[#FAF7EF] px-2.5 py-1 text-xs text-[#4A422F]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Design philosophy */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <div className="max-w-2xl">
          <Eyebrow>Designed for Trust</Eyebrow>
          <h2 style={{ fontFamily: FONT_DISPLAY }} className="mt-4 text-3xl font-medium leading-tight text-[#241F14]">
            The interface stays out of the way of the evidence.
          </h2>
          <p className="mt-6 text-base leading-8 text-[#4A422F]">
            Zoryn's interface is built around clarity, transparency and
            reproducibility rather than decorative dashboards. Every screen
            is designed to make the underlying scientific reasoning easier to
            follow — not to impress with visuals that don't inform the
            decision in front of you.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Quote */}
      <section className="relative overflow-hidden border-y border-[#D8CEB8] bg-[#241F14] py-28 text-center">
        <Contours className="pointer-events-none absolute inset-x-0 bottom-0 h-75 w-full rotate-180 text-[#F3EEE2] opacity-[0.06]" />
        <blockquote className="relative mx-auto max-w-2xl px-8">
          <p style={{ fontFamily: FONT_DISPLAY }} className="text-3xl italic leading-tight text-[#F3EEE2] md:text-4xl">
            "Better environmental decisions begin with understandable
            evidence."
          </p>
        </blockquote>
      </section>

      {/* --------------------------------------------------------- Footer stats */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <Eyebrow>By the Numbers</Eyebrow>
        {/*
          TODO: Replace with real figures once available. Do not populate
          these with placeholder/synthetic numbers — ship "Coming soon"
          until the actual metrics are provided.
        */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Environmental observations processed",
            "H3 cells analysed",
            "Years of historical observations",
            "Explainable reasoning chain",
          ].map((label) => (
            <div
              key={label}
              className="rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF] p-7"
            >
              <p
                style={{ fontFamily: FONT_DISPLAY }} className={`text-3xl font-medium text-[#8A7B5C]`}
              >
                Coming soon
              </p>
              <p className="mt-2 text-sm leading-5 text-[#5A5240]">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}