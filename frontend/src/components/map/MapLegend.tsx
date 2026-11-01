import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { SPI_CLASSES, SPI_FILL_OPACITY } from "@/components/map/spiClasses";

// The SPI-3 classes and their notes. Shared by the floating legend on
// desktop and the map panel on smaller screens.
export function LegendKey() {
  return (
    <>
      <p className="text-xs leading-5 text-[#5A5240]">
        Colours represent the World Meteorological Organization
        Standardized Precipitation Index (SPI-3) classes for the
        selected month.
      </p>

      <div className="mt-4 space-y-2">

        {SPI_CLASSES.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3"
          >
            <span
              className="h-4 w-4 shrink-0 rounded border border-black/10"
              style={{
                backgroundColor: item.color,
                opacity: SPI_FILL_OPACITY,
              }}
            />

            <span className="text-sm text-[#2B2417]">
              {item.label}
            </span>

          </div>
        ))}

      </div>

      <div className="mt-5 border-t border-[#D8CEB8] pt-3">

        <p className="text-xs text-[#5A5240]">
          Based on WMO SPI drought classification. The map colours
          correspond directly to the SPI-3 value for each H3 cell.
        </p>

      </div>
    </>
  );
}

// Floating legend over the map. Below 1024px the legend lives in the
// left map panel instead.
export default function MapLegend() {

  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside className="absolute bottom-6 left-6 z-20 hidden w-72 overflow-hidden rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF]/85 shadow-[0_8px_24px_rgba(43,36,23,0.10)] backdrop-blur-md transition-all duration-300 lg:block lg:w-80">

      <button
        type="button"
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((prev) => !prev)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7C6A45]">
          SPI-3 Classification
        </h3>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#7C6A45] transition-transform duration-300 ${
            collapsed ? "" : "rotate-180"
          }`}
        />
      </button>

      <div
        className={`overflow-y-auto px-4 transition-all duration-300 ${
          collapsed ? "max-h-0" : "max-h-[42vh] pb-4"
        }`}
      >
        <LegendKey />
      </div>

    </aside>
  );

}
