import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

import ExplorerSidebar from "@/components/layout/ExplorerSidebar";

import MapCanvas from "@/components/map/MapCanvas";
import MapToolbar from "@/components/map/MapToolbar";
import MapLegend from "@/components/map/MapLegend";
import { useExplorerStore } from "@/stores/explorerStore";
import { useTimelineStore } from "@/stores/timelineStore";

export default function ExplorerPage() {
  const setAvailableDates = useTimelineStore((state) => state.setAvailableDates);

  // Presentation-only: whether the sidebar drawer is expanded on mobile.
  // Does not touch reasoning selection, timeline, or any app state.
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Open the drawer when a cell is picked, so its reasoning is in view.
  const selectedH3 = useExplorerStore((state) => state.selectedH3);

  useEffect(() => {
    if (selectedH3) {
      setMobileDrawerOpen(true);
    }
  }, [selectedH3]);

  useEffect(() => {
    // TODO: replace with real data source (e.g. backend endpoint
    // exposing the months for which imagery/data actually exists).
    // Placeholder range below is not derived from real coverage data.
    const dates: string[] = [];

    for (let year = 2002; year <= 2024; year++) {
      for (let month = 1; month <= 12; month++) {
        dates.push(`${year}-${String(month).padStart(2, "0")}`);
      }
    }

    setAvailableDates(dates);
  }, [setAvailableDates]);

  return (
    <div className="antialiased flex h-full flex-col overflow-hidden bg-[#FAFAFA] lg:flex-row">
      {/* --------------------------------------------------------- Map */}
      <section className="relative min-h-0 flex-1 overflow-hidden border-[#E5E5E5] lg:border-r">
        <MapCanvas />
        <MapToolbar />
        <MapLegend />
      </section>

      {/* -------------------------------------------------------- Sidebar */}
      {/*
        Below 1024px: bottom drawer under the map. Collapsed it shows only
        its header bar, so the map gets the screen; expanded it takes 65% of
        a phone screen or half of a tablet one.
        Desktop (1024px+):  fixed right sidebar, 420px wide.
        Large monitors (1280px+): 460px wide.
        Very large monitors (1536px+): 500px wide.
      */}
      <section
        className={`
          flex shrink-0 flex-col
          border-t border-[#E5E5E5]
          bg-white
          shadow-[0_-4px_16px_rgba(0,0,0,0.06)]
          transition-[height] duration-300 ease-out

          ${mobileDrawerOpen ? "h-[65%] md:h-1/2" : "h-14"}

          lg:h-full
          lg:w-105
          lg:border-t-0
          lg:border-l
          lg:shadow-none
          lg:transition-none

          xl:w-115
          2xl:w-125
        `}
      >
        {/* Drawer header: always visible below 1024px, toggles the panel */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen((open) => !open)}
          className="flex h-14 shrink-0 items-center gap-3 border-b border-[#E5E5E5] px-4 text-left lg:hidden"
          aria-expanded={mobileDrawerOpen}
          aria-label={mobileDrawerOpen ? "Collapse reasoning panel" : "Expand reasoning panel"}
        >
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-[#1A1A1A]">
              Reasoning
            </span>
            <span className="block truncate text-xs text-[#6B6B6B]">
              {selectedH3 ? `Cell ${selectedH3}` : "Tap a hexagon on the map to begin"}
            </span>
          </span>

          <ChevronUp
            className={`h-5 w-5 shrink-0 text-[#6B6B6B] transition-transform duration-300 ${
              mobileDrawerOpen ? "rotate-180" : ""
            }`}
            strokeWidth={1.75}
          />
        </button>

        <div
          className={`min-h-0 flex-1 overflow-y-auto ${
            mobileDrawerOpen ? "" : "hidden lg:block"
          }`}
        >
          <ExplorerSidebar />
        </div>
      </section>
    </div>
  );
}
