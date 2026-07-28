import { useState } from "react";

import { ChevronDown } from "lucide-react";

import {
  firstLines,
  parseExplanation,
} from "@/utils/reasoningFormat";

type ExplanationSectionProps = {
  explanation: string;
  provider: string;
  model: string;
  latencyMs: number;
  totalTokens: number;
};

export default function ExplanationSection({
  explanation,
  provider,
  model,
  latencyMs,
  totalTokens,
}: ExplanationSectionProps) {
  const [expanded, setExpanded] =
    useState(false);

  const displayedExplanation =
    expanded
      ? explanation
      : firstLines(
          explanation,
          3,
        );

  const sections =
    parseExplanation(
      displayedExplanation,
    );

  return (
    <section className="rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF] shadow-sm">

      <button
        type="button"
        onClick={() =>
          setExpanded(
            !expanded,
          )
        }
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >

        <div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7C6A45]">
            AI Scientific Explanation
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">

            <span className="rounded-full border border-[#D8CEB8] bg-[#F3EEE2] px-2 py-0.5 text-[11px] text-[#4A422F]">
              {provider}
            </span>

            <span className="rounded-full border border-[#D8CEB8] bg-[#F3EEE2] px-2 py-0.5 text-[11px] text-[#4A422F]">
              {model}
            </span>

            <span className="rounded-full border border-[#D8CEB8] bg-[#F3EEE2] px-2 py-0.5 text-[11px] text-[#4A422F]">
              {Math.round(
                latencyMs,
              )}{" "}
              ms
            </span>

            <span className="rounded-full border border-[#D8CEB8] bg-[#F3EEE2] px-2 py-0.5 text-[11px] text-[#4A422F]">
              {totalTokens} tokens
            </span>

          </div>

        </div>

        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            expanded
              ? "rotate-180"
              : ""
          }`}
        />

      </button>

      <div
        className={`grid transition-all duration-200 ${
          expanded
            ? "grid-rows-[1fr]"
            : "grid-rows-[0fr]"
        }`}
      >

        <div className="overflow-hidden">

          <div className="border-t border-[#D8CEB8] px-6 py-5">

            <div className="space-y-6">

              {sections.map(
                (
                  section,
                ) => (

                  <section
                    key={
                      section.title
                    }
                  >

                    <h3 className="mb-2 text-sm font-semibold text-[#2B2417]">
                      {section.title}
                    </h3>

                    <p className="whitespace-pre-line text-sm leading-6 text-[#5A5240]">
                      {section.content}
                    </p>

                  </section>

                ),
              )}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}