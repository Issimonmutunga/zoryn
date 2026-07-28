import { useState } from "react";
import { ChevronDown } from "lucide-react";

type CollapsibleSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export default function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] =
    useState(defaultOpen);

  return (
    <section className="rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF] shadow-sm">

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >

        <div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7C6A45]">
            {title}
          </p>

        </div>

        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />

      </button>

      <div
        className={`grid transition-all duration-200 ${
          open
            ? "grid-rows-[1fr]"
            : "grid-rows-[0fr]"
        }`}
      >

        <div className="overflow-hidden">

          <div className="border-t border-[#D8CEB8] px-6 py-5">

            {children}

          </div>

        </div>

      </div>

    </section>
  );
}