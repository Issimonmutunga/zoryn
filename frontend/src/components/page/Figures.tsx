import type { ReactNode } from "react";

import { confidenceLabel, formatConfidence } from "@/utils/formatConfidence";
import { classifySpi, formatSpi } from "@/utils/spi";

// Number-shaped figures: stat tiles, the confidence meter and the SPI class
// chip. Values and labels always use text colours; a swatch or the bar beside
// them carries the data colour.

export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E5E5E5] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-5">
      <p className="text-xs text-[#6B6B6B]">{label}</p>

      <p className="mt-1.5 text-2xl font-semibold leading-tight text-[#1A1A1A] sm:text-[1.75rem]">
        {value}
      </p>

      {hint && <p className="mt-1 text-xs leading-5 text-[#6B6B6B]">{hint}</p>}
    </div>
  );
}

export function StatRow({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {children}
    </div>
  );
}

/** Confidence as a thin meter with the percentage written beside it. */
export function ConfidenceBar({
  value,
  withLabel = false,
  showValue = true,
}: {
  value: number;
  withLabel?: boolean;
  /** Set false where the percentage is already printed beside the meter. */
  showValue?: boolean;
}) {
  const percent = Math.round(Math.max(0, Math.min(1, value)) * 100);

  return (
    <div className="flex items-center gap-3">
      <div
        role="meter"
        aria-label="Confidence"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}%, ${confidenceLabel(value)}`}
        className="h-1.5 min-w-12 flex-1 overflow-hidden rounded-full bg-[#E5E5E5]"
      >
        <div
          className="h-full rounded-full bg-[#3A3A3A]"
          style={{ width: `${percent}%` }}
        />
      </div>

      {(showValue || withLabel) && (
        <span className="shrink-0 text-sm font-medium tabular-nums text-[#1A1A1A]">
          {showValue && formatConfidence(value)}
          {withLabel && (
            <span
              className={`font-normal text-[#6B6B6B] ${showValue ? "ml-1.5" : ""}`}
            >
              {confidenceLabel(value)}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

/** SPI value with its WMO class: "-1.62 · Severe drought". */
export function SpiChip({
  value,
  showValue = true,
}: {
  value: number | null | undefined;
  showValue?: boolean;
}) {
  const spiClass = classifySpi(value);

  if (!spiClass) {
    return <span className="text-sm text-[#8A8A8A]">No SPI value</span>;
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm text-[#3A3A3A]">
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 shrink-0 rounded-sm border border-black/15"
        style={{ backgroundColor: spiClass.color }}
      />

      {showValue && (
        <span className="font-medium tabular-nums text-[#1A1A1A]">
          {formatSpi(value)}
        </span>
      )}

      <span className="text-[#5A5A5A]">{spiClass.label}</span>
    </span>
  );
}
