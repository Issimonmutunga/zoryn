import { useState } from "react";

import { ChevronDown } from "lucide-react";

export default function MapLegend() {

  const [collapsed, setCollapsed] = useState(true);

  const items = [
    {
      label: "Extremely Wet (SPI ≥ 2.0)",
      color: "#08306b",
    },
    {
      label: "Very Wet (1.5 to 2.0)",
      color: "#2171b5",
    },
    {
      label: "Moderately Wet (1.0 to 1.5)",
      color: "#6baed6",
    },
    {
      label: "Near Normal (-1.0 to 1.0)",
      color: "#d9d9d9",
    },
    {
      label: "Moderate Drought (-1.0 to -1.5)",
      color: "#fdd835",
    },
    {
      label: "Severe Drought (-1.5 to -2.0)",
      color: "#fb8c00",
    },
    {
      label: "Extreme Drought (< -2.0)",
      color: "#c62828",
    },
  ];

  return (
    <aside className="absolute bottom-6 left-6 z-20 w-64 overflow-hidden rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF]/85 shadow-[0_8px_24px_rgba(43,36,23,0.10)] backdrop-blur-md transition-all duration-300 sm:w-72 lg:w-80">

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

        <p className="text-xs leading-5 text-[#5A5240]">
          Colours represent the World Meteorological Organization
          Standardized Precipitation Index (SPI-3) classes for the
          selected month.
        </p>

        <div className="mt-4 space-y-2">

          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3"
            >
              <span
                className="h-4 w-4 shrink-0 rounded border border-black/10"
                style={{
                  backgroundColor: item.color,
                  opacity: 0.45,
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

      </div>

    </aside>
  );

}