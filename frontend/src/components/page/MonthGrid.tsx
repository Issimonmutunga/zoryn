import { useState } from "react";

import { FONT_MONO } from "@/lib/fonts";
import { MONTH_ABBR, toMonthKey } from "@/utils/months";

// Calendar heatmap: one row per year, one column per month. Used for the
// discovery timeline (colour = how many) and for a discovery's evidence
// (filled = a month with supporting evidence).
//
// Cells are separated by a 2px gap in the surface colour rather than by
// borders. Every cell is a real button, so the value is reachable by pointer,
// touch and keyboard; the tooltip repeats what the caption and the table view
// already say.

export interface MonthCell {
  /** Fill colour for the cell. */
  color: string;
  /** Full sentence for the tooltip and screen readers. */
  label: string;
}

const EMPTY_FILL = "#F0F0F0";

export default function MonthGrid({
  years,
  cell,
  emptyLabel,
  selected,
  onSelect,
  caption,
}: {
  /** Years to draw, top to bottom. */
  years: number[];
  /** Returns the cell for a month, or null when the month is empty. */
  cell: (monthKey: string) => MonthCell | null;
  /** Tooltip wording for an empty month, e.g. "no discoveries". */
  emptyLabel: string;
  selected?: string | null;
  onSelect?: (monthKey: string) => void;
  caption: string;
}) {
  const [hint, setHint] = useState<{
    text: string;
    left: number;
    top: number;
  } | null>(null);

  function show(target: HTMLElement, text: string) {
    // Keep the tooltip (max 160px wide) inside the grid so it never causes
    // horizontal scrolling on a phone.
    const half = 84;
    const width = (target.offsetParent as HTMLElement | null)?.clientWidth ?? 0;
    const centre = target.offsetLeft + target.offsetWidth / 2;

    setHint({
      text,
      left: Math.min(Math.max(centre, half), Math.max(half, width - half)),
      top: target.offsetTop,
    });
  }

  return (
    <div className="relative">
      <div
        role="grid"
        aria-label={caption}
        className="grid grid-cols-[2.5rem_repeat(12,minmax(0,1fr))] gap-0.5"
        onPointerLeave={() => setHint(null)}
      >
        <div role="row" className="contents">
          <span role="columnheader" aria-label="Year" />

          {MONTH_ABBR.map((month) => (
            <span
              key={month}
              role="columnheader"
              aria-label={month}
              style={{ fontFamily: FONT_MONO }}
              className="pb-1 text-center text-[10px] uppercase text-[#6B6B6B]"
            >
              <span className="sm:hidden">{month[0]}</span>
              <span className="hidden sm:inline">{month}</span>
            </span>
          ))}
        </div>

        {years.map((year) => (
          <div key={year} role="row" className="contents">
            <span
              role="rowheader"
              style={{ fontFamily: FONT_MONO }}
              className="flex items-center text-[11px] tabular-nums text-[#6B6B6B]"
            >
              {year}
            </span>

            {MONTH_ABBR.map((monthName, monthIndex) => {
              const key = toMonthKey(year, monthIndex + 1);
              const data = cell(key);
              const label = data
                ? data.label
                : `${monthName} ${year}: ${emptyLabel}`;
              const isSelected = selected === key;
              const interactive = Boolean(onSelect) && data !== null;

              return (
                <button
                  key={key}
                  type="button"
                  role="gridcell"
                  aria-label={label}
                  aria-selected={isSelected}
                  aria-disabled={!interactive}
                  tabIndex={data ? 0 : -1}
                  onClick={() => {
                    if (interactive) {
                      onSelect?.(key);
                    }
                  }}
                  onPointerEnter={(event) => show(event.currentTarget, label)}
                  onFocus={(event) => show(event.currentTarget, label)}
                  onBlur={() => setHint(null)}
                  style={{ backgroundColor: data ? data.color : EMPTY_FILL }}
                  className={`h-6 rounded-[3px] outline-none transition-[filter] focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1 sm:h-7 ${
                    interactive ? "cursor-pointer hover:brightness-90" : "cursor-default"
                  } ${isSelected ? "ring-2 ring-[#1A1A1A] ring-offset-1" : ""}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {hint && (
        <div
          role="tooltip"
          style={{ left: hint.left, top: hint.top }}
          className="pointer-events-none absolute z-10 w-max max-w-40 -translate-x-1/2 -translate-y-[calc(100%+6px)] rounded-md bg-[#1A1A1A] px-2.5 py-1.5 text-center text-xs leading-4 text-white shadow-lg"
        >
          {hint.text}
        </div>
      )}
    </div>
  );
}
