import type { ReactNode } from "react";

import { FONT_BODY, FONT_MONO } from "@/lib/fonts";

// Shared building blocks for the data views (Discoveries, Timeline, Hazards,
// Rules, Knowledge Graph, Datasets, Status). They follow the grayscale scheme
// of the existing pages and are sized phone-first: 20px gutters and compact
// headings below the `sm` breakpoint.

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main
      style={{ fontFamily: FONT_BODY }}
      className="antialiased bg-[#FAFAFA] text-[#3A3A3A]"
    >
      {children}
    </main>
  );
}

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("mx-auto w-full max-w-287.5 px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B6B6B]">
      {children}
    </p>
  );
}

/** Small monospace caption used for data labels. */
export function MonoLabel({
  children,
  className,
  inverse = false,
}: {
  children: ReactNode;
  className?: string;
  /** For use on a dark surface. */
  inverse?: boolean;
}) {
  return (
    <p
      style={{ fontFamily: FONT_MONO }}
      className={cx(
        "text-[10px] uppercase tracking-[0.16em]",
        inverse ? "text-[#C9C9C9]" : "text-[#6B6B6B]",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * Page header. The specification organises every screen around the question
 * a user brings to it, so the question is the eyebrow and the title answers
 * "where am I".
 */
export function PageHeader({
  question,
  title,
  lede,
  children,
}: {
  question: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-[#E5E5E5]">
      <Container className="pb-8 pt-8 sm:pb-12 sm:pt-14">
        <Eyebrow>{question}</Eyebrow>

        <h1 className="mt-3 text-3xl font-semibold uppercase leading-[1.1] tracking-normal text-[#1A1A1A] sm:mt-4 sm:text-4xl md:text-5xl">
          {title}
        </h1>

        {lede && (
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5A5A5A] sm:mt-5 sm:text-lg sm:leading-8">
            {lede}
          </p>
        )}

        {children}
      </Container>
    </header>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
}) {
  return (
    <div>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

      <h2
        id={id}
        className={cx(
          "max-w-2xl text-xl font-semibold uppercase leading-tight tracking-normal text-[#1A1A1A] sm:text-2xl",
          eyebrow && "mt-3",
        )}
      >
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B6B6B] sm:leading-7">
          {description}
        </p>
      )}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

type PillTone = "live" | "available" | "planned";

const PILL_TONES: Record<PillTone, string> = {
  live: "border-[#1A1A1A] bg-[#1A1A1A] text-white",
  available: "border-[#CFCFCF] bg-[#F2F2F2] text-[#3A3A3A]",
  planned: "border-dashed border-[#CFCFCF] bg-white text-[#6B6B6B]",
};

/** Status label. State is always written out, never carried by colour alone. */
export function Pill({
  children,
  tone = "available",
}: {
  children: ReactNode;
  tone?: PillTone;
}) {
  return (
    <span
      style={{ fontFamily: FONT_MONO }}
      className={cx(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[10px] uppercase leading-none tracking-[0.12em]",
        PILL_TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

export { cx };
