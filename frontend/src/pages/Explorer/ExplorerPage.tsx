import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronUp } from "lucide-react";

import ExplorerSidebar from "@/components/layout/ExplorerSidebar";

import MapCanvas from "@/components/map/MapCanvas";
import MapToolbar from "@/components/map/MapToolbar";
import MapLegend from "@/components/map/MapLegend";
import { useExplorerStore } from "@/stores/explorerStore";
import { useTimelineStore } from "@/stores/timelineStore";
import { isMonthKey } from "@/utils/months";

export default function ExplorerPage() {
  const setAvailableDates = useTimelineStore((state) => state.setAvailableDates);
  const setSelectedDate = useTimelineStore((state) => state.setSelectedDate);
  const setSelectedH3 = useExplorerStore((state) => state.setSelectedH3);

  const [params] = useSearchParams();
  const linkedDate = params.get("date");
  const linkedH3 = params.get("h3");

  // Presentation-only: whether the sidebar drawer is expanded on mobile.
  // Does not touch reasoning selection, timeline, or any app state.
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

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

    // Deep links from the Discoveries, Timeline and detail views:
    // /explorer?date=YYYY-MM&h3=<cell>. Applied before the default month so
    // the linked month wins.
    if (isMonthKey(linkedDate)) {
      setSelectedDate(linkedDate);
    }

    if (linkedH3) {
      setSelectedH3(linkedH3);
      setMobileDrawerOpen(true);
    }

    setAvailableDates(dates);
  }, [linkedDate, linkedH3, setAvailableDates, setSelectedDate, setSelectedH3]);

  return (
    <main className="antialiased flex h-[calc(100dvh-var(--nav-h)-var(--tabbar-h))] flex-col overflow-hidden bg-[#FAFAFA] lg:flex-row">
      {/* --------------------------------------------------------- Map */}
      <section className="relative flex-1 overflow-hidden border-[#E5E5E5] lg:border-r">
        <MapCanvas />
        <MapToolbar />
        <MapLegend />

        {/* Mobile-only affordance to reopen the drawer once it's collapsed */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className={`absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-2 border-t border-[#E5E5E5] bg-white/90 py-2.5 text-xs font-medium text-[#5A5A5A] backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
            mobileDrawerOpen ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-label="Open reasoning panel"
        >
          <ChevronUp className="h-4 w-4" strokeWidth={1.75} />
          Reasoning panel
        </button>
      </section>

      {/* -------------------------------------------------------- Sidebar */}
      {/*
        Phones (<768px):    bottom drawer, 15dvh collapsed / 65dvh expanded
                            (dvh, so the browser's own bars don't clip it).
        Tablets (768-1023px): bottom panel, 40dvh.
        Desktop (1024px+):  fixed right sidebar, 420px wide.
        Large monitors (1280px+): 460px wide.
        Very large monitors (1536px+): 500px wide.
      */}
      <section
        className={`
          flex flex-col
          border-t border-[#E5E5E5]
          bg-white
          shadow-[0_-1px_2px_rgba(0,0,0,0.03)]
          transition-[height] duration-300 ease-out

          ${mobileDrawerOpen ? "h-[65dvh]" : "h-[15dvh]"}

          md:h-[40dvh]

          lg:h-full
          lg:w-105
          lg:shrink-0
          lg:border-t-0
          lg:border-l
          lg:shadow-none
          lg:transition-none

          xl:w-115
          2xl:w-125
        `}
      >
        {/* Mobile drawer handle */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen((open) => !open)}
          className="flex min-h-8 items-center justify-center py-2 lg:hidden"
          aria-label={mobileDrawerOpen ? "Collapse reasoning panel" : "Expand reasoning panel"}
        >
          <span className="h-1 w-10 rounded-full bg-[#E5E5E5]" />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <ExplorerSidebar />
        </div>
      </section>
    </main>
  );
}