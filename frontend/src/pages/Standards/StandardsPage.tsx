import { Link } from "react-router-dom";
import type { ElementType, ReactNode } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Gauge,
  Globe2,
  ShieldAlert,
  GitBranch,
  MessageSquareText,
  ListTree,
  FlaskConical,
  Eye,
  RefreshCw,
  BookOpenCheck,
  SearchCheck,
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

// --------------------------------------------------------------- Standards data
type StandardCard = {
  icon: ElementType;
  code: string;
  name: string;
  purpose: string;
  role: string;
};

const standards: StandardCard[] = [
  {
    icon: Gauge,
    code: "WMO",
    name: "World Meteorological Organization",
    purpose: "Standardized Precipitation Index (SPI) methodology.",
    role: "Governs how meteorological drought severity is classified.",
  },
  {
    icon: Globe2,
    code: "IPCC",
    name: "Intergovernmental Panel on Climate Change",
    purpose: "Shared climate risk terminology and hazard framing.",
    role: "Anchors how climate conditions are interpreted and named.",
  },
  {
    icon: ShieldAlert,
    code: "ISO 14091",
    name: "Climate Adaptation Assessment",
    purpose: "International risk assessment framework.",
    role: "Structures how environmental risk is scored.",
  },
  {
    icon: GitBranch,
    code: "DER",
    name: "Deterministic Environmental Reasoning",
    purpose: "Zoryn's rule-based scientific reasoning engine.",
    role: "Produces every discovery from evidence, not inference.",
  },
  {
    icon: MessageSquareText,
    code: "AI",
    name: "Transparent AI",
    purpose: "Natural-language explanation layer.",
    role: "Explains discoveries — never determines them.",
  },
  {
    icon: ListTree,
    code: "TRACE",
    name: "Scientific Traceability",
    purpose: "A visible, inspectable evidence chain.",
    role: "Lets every conclusion be followed back to its source.",
  },
];

// -------------------------------------------------------------- Trust architecture
const trustFlow = [
  "Observation",
  "Scientific Standard",
  "Environmental Signature",
  "Evidence",
  "Pattern",
  "Hypothesis",
  "Discovery",
  "Explanation",
];

// -------------------------------------------------------------- Principles
type Principle = { icon: ElementType; title: string; text: string };

const principles: Principle[] = [
  { icon: FlaskConical, title: "Evidence First", text: "No conclusion is formed without supporting environmental evidence." },
  { icon: Eye, title: "Transparency", text: "Every reasoning step is visible, not hidden inside a model." },
  { icon: RefreshCw, title: "Reproducibility", text: "The same observations always regenerate the same discovery." },
  { icon: BookOpenCheck, title: "Standards Driven", text: "Reasoning applies recognised scientific standards, never invented rules." },
  { icon: GitBranch, title: "Deterministic", text: "Discoveries are computed, not predicted or guessed at." },
  { icon: SearchCheck, title: "Explainability", text: "Any conclusion can be inspected down to its evidence." },
];

// -------------------------------------------------------------- AI governance
const governanceRules = [
  "AI never creates discoveries.",
  "AI never changes evidence.",
  "AI never modifies confidence.",
  "AI only communicates deterministic reasoning.",
];

export default function StandardsPage() {
  return (
    <main
      style={{ fontFamily: FONT_BODY }}
      className="bg-[#F3EEE2] text-[#2B2417]"
    >
      {/* ------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-[#D8CEB8]">
        <Contours className="pointer-events-none absolute inset-x-0 top-0 h-105 w-full text-[#39492F] opacity-[0.35]" />
        <div className="relative mx-auto max-w-287.5 px-8 pb-24 pt-28">
          <Eyebrow>Scientific Standards</Eyebrow>
          <h1
            style={{ fontFamily: FONT_DISPLAY }}
            className="mt-5 max-w-3xl text-5xl font-medium leading-[1.08] tracking-tight text-[#241F14] md:text-6xl"
          >
            Built on science. Designed for trust.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#4A422F]">
            Every discovery Zoryn produces is grounded in internationally
            recognised scientific methods, transparent deterministic
            reasoning, and authoritative environmental observations — not in
            what a model predicts is likely.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------- Why standards matter */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <Eyebrow>Why Standards Matter</Eyebrow>
            <h2
              style={{ fontFamily: FONT_DISPLAY }}
              className="mt-4 text-3xl font-medium leading-tight text-[#241F14]"
            >
              Trust begins with
              <br />
              scientific standards.
            </h2>
          </div>
          <div className="max-w-xl">
            <p className="text-base leading-8 text-[#4A422F]">
              Environmental intelligence is only as valuable as the methods
              behind it. A discovery that can't be checked against a
              recognised standard is just an assertion — however confident it
              sounds.
            </p>
            <p className="mt-5 text-base leading-8 text-[#4A422F]">
              Zoryn's reasoning is built to satisfy four requirements at
              once: it has to be repeatable, transparent about its
              evidence, grounded in internationally recognised science, and
              governed by rules no single output can override.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["Repeatability", "Transparency", "Evidence", "Governance"].map((item) => (
                <div
                  key={item}
                  style={{ fontFamily: FONT_MONO }}
                  className="rounded-lg border border-[#D8CEB8] bg-[#FAF7EF] px-3 py-2.5 text-center text-[11px] uppercase tracking-[0.08em] text-[#5B6B45]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Standards framework */}
      <section className="border-y border-[#D8CEB8] bg-[#EDE6D3]">
        <div className="mx-auto max-w-287.5 px-8 py-24">
          <Eyebrow>Standards Framework</Eyebrow>
          <h2
            style={{ fontFamily: FONT_DISPLAY }}
            className="mt-4 max-w-xl text-3xl font-medium leading-tight text-[#241F14]"
          >
            The standards Zoryn reasons with.
          </h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {standards.map(({ icon: Icon, code, name, purpose, role }) => (
              <div
                key={code}
                className="group flex flex-col rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF] p-6 shadow-[0_1px_2px_rgba(43,36,23,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(43,36,23,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8CEB8] bg-[#F3EEE2]">
                    <Icon className="h-4 w-4 text-[#5B6B45]" strokeWidth={1.75} />
                  </div>
                  <span
                    style={{ fontFamily: FONT_MONO }}
                    className="rounded-md border border-[#D8CEB8] bg-[#F3EEE2] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#8A7B5C]"
                  >
                    {code}
                  </span>
                </div>

                <h3
                  style={{ fontFamily: FONT_DISPLAY }}
                  className="mt-5 text-lg font-medium leading-snug text-[#241F14]"
                >
                  {name}
                </h3>

                <div className="mt-4 space-y-3 border-t border-[#D8CEB8] pt-4">
                  <div>
                    <p style={{ fontFamily: FONT_MONO }} className="text-[10px] uppercase tracking-[0.16em] text-[#8A7B5C]">
                      Purpose
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#5A5240]">{purpose}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: FONT_MONO }} className="text-[10px] uppercase tracking-[0.16em] text-[#8A7B5C]">
                      Role in Zoryn
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#5A5240]">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Trust architecture */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <Eyebrow>Trust Architecture</Eyebrow>
        <h2
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-4 max-w-xl text-3xl font-medium leading-tight text-[#241F14]"
        >
          Where standards enter the reasoning.
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5A5240]">
          Scientific standards are applied early — before a signature ever
          becomes evidence. Artificial intelligence enters only at the very
          last step, once a discovery already exists.
        </p>

        <div className="relative mt-14 flex flex-col items-center">
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#D8CEB8]" />
          {trustFlow.map((step, i) => {
            const isExplanation = step === "Explanation";
            return (
              <div key={step} className="relative flex w-full max-w-md flex-col items-center">
                <div
                  className={`relative z-10 flex w-full items-center justify-center rounded-xl border px-6 py-4 text-center ${
                    isExplanation
                      ? "border-[#5B6B45]/40 bg-[#241F14] text-[#F3EEE2] shadow-[0_8px_24px_rgba(43,36,23,0.15)]"
                      : "border-[#D8CEB8] bg-[#FAF7EF] text-[#241F14]"
                  }`}
                >
                  <span
                    style={{ fontFamily: FONT_MONO }}
                    className={`mr-3 text-[11px] ${isExplanation ? "text-[#B7C79A]" : "text-[#8A7B5C]"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontFamily: FONT_DISPLAY }} className="text-base font-medium">
                    {step}
                  </span>
                  {isExplanation && (
                    <span
                      style={{ fontFamily: FONT_MONO }}
                      className="ml-3 rounded-full border border-[#5B6B45]/40 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-[#B7C79A]"
                    >
                      AI enters here
                    </span>
                  )}
                </div>
                {i < trustFlow.length - 1 && (
                  <div className="relative z-10 py-2 text-[#8A7B5C]">↓</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------------------------------------- Principles of integrity */}
      <section className="border-y border-[#D8CEB8] bg-[#EDE6D3]">
        <div className="mx-auto max-w-287.5 px-8 py-24">
          <Eyebrow>Principles of Scientific Integrity</Eyebrow>
          <h2
            style={{ fontFamily: FONT_DISPLAY }}
            className="mt-4 max-w-lg text-3xl font-medium leading-tight text-[#241F14]"
          >
            What every discovery is held to.
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

      {/* --------------------------------------------------------------- AI governance */}
      <section className="relative overflow-hidden border-y border-[#D8CEB8] bg-[#241F14] text-[#F3EEE2]">
        <Contours className="pointer-events-none absolute inset-x-0 bottom-0 h-75 w-full rotate-180 text-[#F3EEE2] opacity-[0.06]" />
        <div className="relative mx-auto max-w-287.5 px-8 py-24">
          <Eyebrow>AI Governance</Eyebrow>
          <h2
            style={{ fontFamily: FONT_DISPLAY }}
            className="mt-4 max-w-xl text-3xl font-medium leading-tight text-[#F3EEE2] md:text-4xl"
          >
            AI explains.
            <br />
            Science decides.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {governanceRules.map((rule) => (
              <div
                key={rule}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/3 p-5"
              >
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#B7C79A]" strokeWidth={1.75} />
                <p className="text-sm leading-6 text-[#D8CEB8]">{rule}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-sm leading-7 text-[#B9AE8C]">
            Language models are used exclusively to translate a completed,
            deterministic discovery into plain language — they hold no
            authority over what that discovery is.
          </p>
        </div>
      </section>

      {/* ----------------------------------------------- Commitment to evolution */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <Eyebrow>Looking Ahead</Eyebrow>
            <h2
              style={{ fontFamily: FONT_DISPLAY }}
              className="mt-4 text-3xl font-medium leading-tight text-[#241F14]"
            >
              Committed to scientific evolution.
            </h2>
          </div>
          <div className="max-w-xl">
            <p className="text-base leading-8 text-[#4A422F]">
              Zoryn will continue adopting internationally recognised
              scientific standards as the platform matures. Meteorological
              drought is the current focus — the same evidence-first
              approach is built to extend to other environmental domains over
              time.
            </p>
            <p className="mt-5 text-base leading-8 text-[#4A422F]">
              No specific future implementation is promised here. What is
              guaranteed is the principle behind it: any new domain Zoryn
              takes on will be held to the same standards-driven, transparent
              reasoning as the one it applies today.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Closing */}
      <section className="border-t border-[#D8CEB8] bg-[#EDE6D3]">
        <div className="mx-auto max-w-287.5 px-8 py-24">
          <div className="rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF] p-10 text-center shadow-[0_1px_2px_rgba(43,36,23,0.04)] md:p-14">
            <ShieldCheck className="mx-auto h-6 w-6 text-[#5B6B45]" strokeWidth={1.5} />
            <h2
              style={{ fontFamily: FONT_DISPLAY }}
              className="mx-auto mt-5 max-w-2xl text-3xl font-medium leading-tight text-[#241F14] md:text-4xl"
            >
              Transparent environmental intelligence begins with transparent
              science.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#5A5240]">
              Every environmental discovery should remain understandable,
              reproducible and scientifically defensible — from the first
              observation to the final decision.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/methodology"
                className="group flex items-center gap-2 rounded-lg bg-[#39492F] px-6 py-3 text-sm font-semibold text-[#F3EEE2] transition hover:bg-[#2E3B25]"
              >
                Explore Methodology
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
              </Link>

              <Link
                to="/explorer"
                className="rounded-lg border border-[#D8CEB8] bg-[#F3EEE2] px-6 py-3 text-sm font-semibold text-[#3A3221] transition hover:bg-[#EDE6D3]"
              >
                Open Explorer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}