import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import type { DiscoveryTimelineItem } from "@/services/api/discoveries";
import { formatMonth } from "@/utils/months";

// Month selector limited to the months that actually contain discoveries.
// A native <select> is used on purpose: on phones it opens the system picker,
// which is easier to operate than a custom dropdown. The 16px font on small
// screens stops iOS from zooming the page when the control is focused.

const stepButton =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#3A3A3A] transition-colors hover:bg-[#F2F2F2] disabled:cursor-not-allowed disabled:opacity-40";

export default function MonthPicker({
  months,
  value,
  onChange,
  label = "Month",
}: {
  /** Months with discoveries, oldest first. */
  months: DiscoveryTimelineItem[];
  value: string | null;
  onChange: (month: string) => void;
  label?: string;
}) {
  const index = months.findIndex((item) => item.timestamp === value);
  const known = index >= 0;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={stepButton}
        aria-label="Previous month with discoveries"
        disabled={!known || index === 0}
        onClick={() => onChange(months[index - 1].timestamp)}
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </button>

      <div className="relative min-w-0 flex-1">
        <select
          aria-label={label}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none truncate rounded-lg border border-[#E5E5E5] bg-white pl-3 pr-9 text-base font-medium text-[#1A1A1A] outline-none transition-colors focus-visible:border-[#1A1A1A] sm:text-sm"
        >
          {!known && value && (
            <option value={value}>{formatMonth(value)} · no discoveries</option>
          )}

          {[...months].reverse().map((item) => (
            <option key={item.timestamp} value={item.timestamp}>
              {formatMonth(item.timestamp)} · {item.discoveries.toLocaleString()}
            </option>
          ))}
        </select>

        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </div>

      <button
        type="button"
        className={stepButton}
        aria-label="Next month with discoveries"
        disabled={!known || index === months.length - 1}
        onClick={() => onChange(months[index + 1].timestamp)}
      >
        <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );
}
