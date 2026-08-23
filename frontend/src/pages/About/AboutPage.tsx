import type { ReactNode, ElementType } from "react";
import { Waves, RefreshCw, SearchCheck, AlertTriangle, Sparkles } from "lucide-react";

// Fonts are loaded via <link> tags in index.html (see the snippet in the
// accompanying note) — Vite has no next/font equivalent, so we reference
// the family names directly here.
//
// UI pass: matched to the rest of the site — dropped Fraunces for headings
// in favor of IBM Plex Sans (font-semibold, uppercase, normal tracking
// rather than font-black/tight), moved off the cream/olive palette to a
// soft grayscale black/white scheme (#1A1A1A on #FAFAFA, not pure
// black/white), and added `antialiased` at the root.
//
// Structure pass: rebuilt around the manifesto with a tighter narrative —
// What Zoryn is → Why it exists → How it thinks → What it's trying to
// discover → Long-term vision. Dropped "The Problem" (generic, not
// Zoryn-specific), "Our Vision" (folded into the long-term vision close),
// "Our Philosophy" and "Intelligence" (merged into "How Zoryn Thinks"),
// "Responsibility" (belongs on the Standards page), the old Applications/
// Technology/Quote/Footer-stats sections, and — per request — the "How
// Zoryn Works" pipeline and "Scientific Principles" list (both covered on
// the Methodology/Standards pages). The "not replacing scientists" and
// "continuous learning" ideas are each stated once, in the closing
// section.
const FONT_BODY = "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif";

function Divider() {
  return (
    <div className="relative h-px w-full bg-[#E5E5E5]">
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6B6B6B]" />
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B6B6B]">
      {children}
    </p>
  );
}

type Card = { icon: ElementType; title: string; text: string };

const howItThinks: Card[] = [
  {
    icon: Waves,
    title: "Relationships, Not Variables",
    text: "The Earth is a network of interacting processes. Understanding comes from how observations relate to each other, not from any one of them in isolation.",
  },
  {
    icon: RefreshCw,
    title: "Improvement, Not Certainty",
    text: "Facts are permanent, but knowledge evolves and theories improve. Zoryn isn't built to reach certainty — it's built to keep getting better at understanding.",
  },
  {
    icon: SearchCheck,
    title: "Explanation, Not Prediction",
    text: "Intelligence isn't memorisation or optimisation. It's the continuous construction of better explanations — prediction follows from that, not the other way round.",
  },
];

const discovery: Card[] = [
  {
    icon: AlertTriangle,
    title: "Early Signals",
    text: "Early warning isn't detecting disasters — it's recognising the earliest signs that the Earth's processes are beginning to organise into something new, before impact.",
  },
  {
    icon: Sparkles,
    title: "Unexpected Discovery",
    text: "The most valuable findings are rarely the ones anticipated in advance. Zoryn searches for unexpected patterns, relationships and explanations, not just expected behaviour.",
  },
];

export default function AboutPage() {
  return (
    <main
      style={{ fontFamily: FONT_BODY }}
      className="antialiased bg-[#FAFAFA] text-[#3A3A3A]"
    >
      {/* --------------------------------------------------- 1. What Zoryn Is */}
      <section className="relative overflow-hidden border-b border-[#E5E5E5]">
        <div className="relative mx-auto max-w-287.5 px-8 pb-24 pt-28">
          <Eyebrow>What Zoryn Is</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold uppercase leading-[1.08] tracking-normal text-[#1A1A1A] md:text-6xl">
            A system built to understand the Earth, not just observe it.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5A5A5A]">
            Zoryn reads authoritative environmental data and builds a
            traceable reasoning chain from it — observations become
            signatures, signatures become relationships, relationships
            become evidence, and evidence becomes a discovery. Every
            conclusion carries the full chain behind it, so it can always be
            followed back to where it started.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------- 2. Why Zoryn Exists */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <Eyebrow>Why Zoryn Exists</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold uppercase leading-tight tracking-normal text-[#1A1A1A]">
              The Earth is changing faster than our ability to understand it.
            </h2>
          </div>
          <div className="max-w-xl">
            <p className="text-base leading-8 text-[#5A5A5A]">
              We've built extraordinary tools for measuring the Earth —
              satellites, sensors, models, field reports — but observations
              alone don't produce understanding.
            </p>
            <p className="mt-5 text-base leading-8 text-[#5A5A5A]">
              Too often, change is only recognised once it's already
              obvious. Knowledge accumulates more slowly than the world it's
              trying to keep up with.
            </p>
            <p className="mt-5 text-base leading-8 text-[#5A5A5A]">
              Zoryn exists to close that gap — not by predicting more
              variables, but by helping turn observation into understanding.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-287.5 px-8">
        <Divider />
      </div>

      {/* ------------------------------------------------- 3. How Zoryn Thinks */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <Eyebrow>How Zoryn Thinks</Eyebrow>
        <h2 className="mt-4 max-w-lg text-3xl font-semibold uppercase leading-tight tracking-normal text-[#1A1A1A]">
          Understanding comes from relationships, not isolated numbers.
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {howItThinks.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
            >
              <Icon className="h-5 w-5 text-[#6B6B6B]" strokeWidth={1.75} />
              <h3 className="mt-4 text-lg font-semibold text-[#1A1A1A]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B6B6B]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------- 4. What Zoryn Is Trying to Discover */}
      <section className="mx-auto max-w-287.5 px-8 py-24">
        <Eyebrow>What Zoryn Is Trying to Discover</Eyebrow>
        <h2 className="mt-4 max-w-lg text-3xl font-semibold uppercase leading-tight tracking-normal text-[#1A1A1A]">
          The earliest signs, before they become obvious impacts.
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {discovery.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-[#E5E5E5] bg-white p-7">
              <Icon className="h-5 w-5 text-[#6B6B6B]" strokeWidth={1.75} />
              <h3 className="mt-4 text-lg font-semibold text-[#1A1A1A]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B6B6B]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- 5. Long-Term Vision */}
      <section className="relative overflow-hidden border-t border-[#E5E5E5] bg-[#1A1A1A] py-28 text-center">
        <div className="relative mx-auto max-w-2xl px-8">
          <Eyebrow>The Long-Term Vision</Eyebrow>
          <p className="mt-6 text-3xl italic leading-tight text-white md:text-4xl">
            "The goal is a reasoning system that keeps learning alongside
            scientists, extending their work rather than standing in for
            it."
          </p>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-[#C9C9C9]">
            The future of Earth intelligence isn't in predicting more
            variables. It's in turning observation into knowledge,
            knowledge into understanding, and understanding into wiser
            decisions — work that never finishes, because the Earth never
            stops changing.
          </p>
        </div>
      </section>
    </main>
  );
}