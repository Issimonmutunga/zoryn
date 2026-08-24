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
} from "lucide-react";

// Fonts are loaded via <link> tags in index.html — see the note that
// accompanies this file. No next/font here since this is a Vite app.
//
// UI pass: matched to Home/Methodology's palette and type treatment —
// dropped Fraunces for headings in favor of IBM Plex Sans (font-semibold,
// uppercase, normal tracking rather than font-black/tight, for smoother
// edges), moved off the cream/olive scheme to a soft grayscale black/white
// palette (near-black #1A1A1A on off-white #FAFAFA, not pure black/white),
// and added `antialiased` at the root. FONT_MONO retained for the data
// labels (Purpose/Role, code badges, step numbers) as on the Methodology
// page.
//
// Structure pass: removed the "Principles of Scientific Integrity" section
// (its content overlapped Trust Architecture); condensed "AI Governance"
// to its core "AI explains. Science decides." message, dropping the four
// rule cards and closing paragraph that repeated ground already covered
// by the standards cards and Trust Architecture; condensed "Looking Ahead"
// to a single short paragraph.
//
// Sourcing pass: WMO, IPCC and ISO 14091 cards now link out to their
// official documentation (WMO SPI User Guide on the WMO e-Library, the
// IPCC AR6 glossary, and the ISO 14091:2021 standard page on iso.org).
// DER, AI and TRACE are Zoryn's own frameworks and remain unlinked.
// ISO 14091's purpose/role copy was corrected — the standard provides
// guidelines for vulnerability, impacts and risk assessment; it does not
// prescribe a universal risk-scoring formula.
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
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B6B6B]">
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
  href?: string;
};

const standards: StandardCard[] = [
  {
    icon: Gauge,
    code: "WMO",
    name: "World Meteorological Organization",
    purpose: "Standardized Precipitation Index (SPI) methodology.",
    role: "Governs how meteorological drought severity is classified.",
    href: "https://library.wmo.int/records/item/39629-standardized-precipitation-index-user-guide",
  },
  {
    icon: Globe2,
    code: "IPCC",
    name: "Intergovernmental Panel on Climate Change",
    purpose: "Shared climate risk terminology and hazard framing.",
    role: "Anchors how climate conditions are interpreted and named.",
    href: "https://apps.ipcc.ch/glossary/",
  },
  {
    icon: ShieldAlert,
    code: "ISO 14091",
    name: "Climate Adaptation Assessment",
    purpose:
      "International framework for climate vulnerability, impacts and risk assessment.",
    role: "Guides how climate-related risk assessment is structured.",
    href: "https://www.iso.org/standard/68508.html",
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

export default function StandardsPage() {
  return (
    <main
      style={{ fontFamily: FONT_BODY }}
      className="antialiased bg-[#FAFAFA] text-[#3A3A3A]"
    >
      {/* ------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-[#E5E5E5]">
        <Contours className="pointer-events-none absolute inset-x-0 top-0 h-105 w-full text-[#1A1A1A] opacity-[0.06]" />
        <div className="relative mx-auto max-w-287.5 px-8 pb-24 pt-28">
          <Eyebrow>Scientific Standards</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold uppercase leading-[1.08] tracking-normal text-[#1A1A1A] md:text-6xl">
            Built on science. Designed for trust.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5A5A5A]">
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
            <h2 className="mt-4 text-3xl font-semibold uppercase leading-tight tracking-normal text-[#1A1A1A]">
              Trust begins with
              <br />
              scientific standards.
            </h2>
          </div>
          <div className="max-w-xl">
            <p className="text-base leading-8 text-[#5A5A5A]">
              Environmental intelligence is only as valuable as the methods
              behind it. A discovery that can't be checked against a
              recognised standard is just an assertion — however confident it
              sounds.
            </p>
            <p className="mt-5 text-base leading-8 text-[#5A5A5A]">
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
                  className="rounded-lg border border-[#E5E5E5] bg-white px-3 py-2.5 text-center text-[11px] uppercase tracking-[0.08em] text-[#6B6B6B]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Standards framework */}
      <section className="border-y border-[#E5E5E5] bg-[#F2F2F2]">
        <div className="mx-auto max-w-287.5 px-8 py-24">
          <Eyebrow>Standards Framework</Eyebrow>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold uppercase leading-tight tracking-normal text-[#1A1A1A]">
            The standards Zoryn reasons with.
          </h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {standards.map(({ icon: Icon, code, name, purpose, role, href }) => {
              const CardTag = href ? "a" : "div";
              const cardProps = href
                ? { href, target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <CardTag
                  key={code}
                  {...cardProps}
                  className={`group flex flex-col rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] ${
                    href ? "cursor-pointer" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#F2F2F2]">
                      <Icon className="h-4 w-4 text-[#6B6B6B]" strokeWidth={1.75} />
                    </div>
                    <span
                      style={{ fontFamily: FONT_MONO }}
                      className="rounded-md border border-[#E5E5E5] bg-[#F2F2F2] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#6B6B6B]"
                    >
                      {code}
                    </span>
                  </div>

                  <h3 className="mt-5 flex items-center gap-2 text-lg font-semibold leading-snug text-[#1A1A1A]">
                    {name}
                    {href && (
                      <ArrowRight
                        className="h-3.5 w-3.5 -rotate-45 text-[#9A9A9A] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        strokeWidth={2}
                      />
                    )}
                  </h3>

                  <div className="mt-4 space-y-3 border-t border-[#E5E5E5] pt-4">
                    <div>
                      <p style={{ fontFamily: FONT_MONO }} className="text-[10px] uppercase tracking-[0.16em] text-[#6B6B6B]">
                        Purpose
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#3A3A3A]">{purpose}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily: FONT_MONO }} className="text-[10px] uppercase tracking-[0.16em] text-[#6B6B6B]">
                        Role in Zoryn
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#3A3A3A]">{role}</p>
                    </div>
                  </div>
                </CardTag>
              );
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Trust architecture */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <Eyebrow>Trust Architecture</Eyebrow>
        <h2 className="mt-4 max-w-xl text-3xl font-semibold uppercase leading-tight tracking-normal text-[#1A1A1A]">
          Where standards enter the reasoning.
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6B6B6B]">
          Scientific standards are applied early — before a signature ever
          becomes evidence. Artificial intelligence enters only at the very
          last step, once a discovery already exists.
        </p>

        <div className="relative mt-14 flex flex-col items-center">
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#E5E5E5]" />
          {trustFlow.map((step, i) => {
            const isExplanation = step === "Explanation";
            return (
              <div key={step} className="relative flex w-full max-w-md flex-col items-center">
                <div
                  className={`relative z-10 flex w-full items-center justify-center rounded-xl border px-6 py-4 text-center ${
                    isExplanation
                      ? "border-white/15 bg-[#1A1A1A] text-white shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                      : "border-[#E5E5E5] bg-white text-[#1A1A1A]"
                  }`}
                >
                  <span
                    style={{ fontFamily: FONT_MONO }}
                    className={`mr-3 text-[11px] ${isExplanation ? "text-[#C9C9C9]" : "text-[#6B6B6B]"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base font-semibold">{step}</span>
                  {isExplanation && (
                    <span
                      style={{ fontFamily: FONT_MONO }}
                      className="ml-3 rounded-full border border-white/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-[#C9C9C9]"
                    >
                      AI enters here
                    </span>
                  )}
                </div>
                {i < trustFlow.length - 1 && (
                  <div className="relative z-10 py-2 text-[#6B6B6B]">↓</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------------------- AI governance */}
      <section className="relative overflow-hidden border-y border-[#E5E5E5] bg-[#1A1A1A] text-white">
        <Contours className="pointer-events-none absolute inset-x-0 bottom-0 h-75 w-full rotate-180 text-white opacity-[0.06]" />
        <div className="relative mx-auto max-w-287.5 px-8 py-24 text-center">
          <Eyebrow>AI Governance</Eyebrow>
          <ShieldCheck className="mx-auto mt-5 h-6 w-6 text-[#C9C9C9]" strokeWidth={1.5} />
          <h2 className="mx-auto mt-5 max-w-xl text-3xl font-semibold uppercase leading-tight tracking-normal text-white md:text-4xl">
            AI explains.
            <br />
            Science decides.
          </h2>
        </div>
      </section>

      {/* ----------------------------------------------- Commitment to evolution */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <Eyebrow>Looking Ahead</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold uppercase leading-tight tracking-normal text-[#1A1A1A]">
              Committed to scientific evolution.
            </h2>
          </div>
          <div className="max-w-xl">
            <p className="text-base leading-8 text-[#5A5A5A]">
              Zoryn will continue adopting internationally recognised
              scientific standards as it matures beyond meteorological
              drought — any new environmental domain it takes on will be
              held to the same evidence-first, standards-driven reasoning it
              applies today.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Closing */}
      <section className="border-t border-[#E5E5E5] bg-[#F2F2F2]">
        <div className="mx-auto max-w-287.5 px-8 py-24">
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-10 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03)] md:p-14">
            <ShieldCheck className="mx-auto h-6 w-6 text-[#6B6B6B]" strokeWidth={1.5} />
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold uppercase leading-tight tracking-normal text-[#1A1A1A] md:text-4xl">
              Transparent environmental intelligence begins with transparent
              science.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#5A5A5A]">
              Every environmental discovery should remain understandable,
              reproducible and scientifically defensible — from the first
              observation to the final decision.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/methodology"
                className="group flex items-center gap-2 rounded-lg bg-[#1A1A1A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                Explore Methodology
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
              </Link>

              <Link
                to="/explorer"
                className="rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-6 py-3 text-sm font-semibold text-[#3A3A3A] transition hover:bg-[#F2F2F2]"
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