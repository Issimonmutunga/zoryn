import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layers, PanelRightOpen, X } from "lucide-react";

import ExplorerSidebar from "@/components/layout/ExplorerSidebar";

import LayerSelector from "@/components/map/LayerSelector";
import MapCanvas from "@/components/map/MapCanvas";
import MapToolbar from "@/components/map/MapToolbar";
import MapLegend, { LegendKey } from "@/components/map/MapLegend";
import { mapApi } from "@/services/api/map";
import { useExplorerStore } from "@/stores/explorerStore";
import { useTimelineStore } from "@/stores/timelineStore";

// Below 1024px the map takes the whole workspace and everything else
// lives in side panels that slide over it: the map key on the left and
// the reasoning on the right. From 1024px the reasoning is a fixed right
// sidebar and the map key floats over the map.
type Panel = "map" | "reasoning";

interface PanelHeaderProps {
  title: string;
  subtitle: string;
  onClose: () => void;
  className?: string;
}

function PanelHeader({ title, subtitle, onClose, className = "" }: PanelHeaderProps) {
  return (
    <div
      className={`flex h-14 shrink-0 items-center gap-3 border-b border-[#E5E5E5] bg-white px-4 ${className}`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#1A1A1A]">{title}</p>
        <p className="truncate text-xs text-[#6B6B6B]">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#E5E5E5] text-[#5A5A5A] transition-colors duration-200 hover:bg-[#F2F2F2]"
        aria-label={`Close ${title.toLowerCase()} panel`}
      >
        <X className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}

// Below 1024px the panels overlay the map; above it the reasoning panel is
// a sidebar and the map key isn't a panel at all.
const COMPACT_QUERY = "(max-width: 1023.98px)";

function useIsCompact() {
  const [compact, setCompact] = useState(
    () => window.matchMedia(COMPACT_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(COMPACT_QUERY);
    const update = () => setCompact(query.matches);

    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return compact;
}

// Panels become visible as soon as they start sliding in (so they can take
// focus straight away) and hidden only once they have slid out.
const PANEL_OPEN = "visible translate-x-0 [transition:translate_300ms_ease-out,visibility_0s]";
const PANEL_CLOSED = "invisible [transition:translate_300ms_ease-out,visibility_0s_linear_300ms]";

const launcherClass =
  "pointer-events-auto flex h-11 items-center gap-2 rounded-full border border-[#E5E5E5] bg-white/95 px-4 text-sm font-medium text-[#1A1A1A] shadow-[0_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-colors duration-200 hover:bg-[#F2F2F2]";

export default function ExplorerPage() {
  const setAvailableDates = useTimelineStore((state) => state.setAvailableDates);
  const selectedH3 = useExplorerStore((state) => state.selectedH3);

  // Presentation-only: which side panel is open below 1024px.
  const [openPanel, setOpenPanel] = useState<Panel | null>(null);
  const isCompact = useIsCompact();

  const mapSectionRef = useRef<HTMLElement>(null);
  const mapPanelRef = useRef<HTMLElement>(null);
  const reasoningPanelRef = useRef<HTMLElement>(null);

  // The control that opened a panel gets focus back when it closes.
  const returnFocusRef = useRef<HTMLElement | null>(null);

  function openPanelFrom(panel: Panel) {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setOpenPanel(panel);
  }

  function closePanel() {
    setOpenPanel(null);
  }

  // An open panel works like a dialog over the map: focus moves into it
  // and the map behind it can't be reached. On close, focus goes back to
  // whatever opened it once the map is reachable again.
  useEffect(() => {
    const overlaid = isCompact && openPanel !== null;

    if (overlaid) {
      const panel =
        openPanel === "map" ? mapPanelRef.current : reasoningPanelRef.current;

      panel?.focus({ preventScroll: true });
    }

    if (mapSectionRef.current) {
      mapSectionRef.current.inert = overlaid;
    }

    if (!overlaid && returnFocusRef.current) {
      returnFocusRef.current.focus({ preventScroll: true });
      returnFocusRef.current = null;
    }
  }, [isCompact, openPanel]);

  // Show the reasoning as soon as a cell is picked.
  useEffect(() => {
    if (selectedH3) {
      setOpenPanel("reasoning");
    }
  }, [selectedH3]);

  useEffect(() => {
    if (!openPanel) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePanel();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [openPanel]);

  const { data: months } = useQuery({
    queryKey: ["map", "months"],
    queryFn: () => mapApi.getMonths(),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (months) {
      setAvailableDates(months);
    }
  }, [months, setAvailableDates]);

  return (
    <div className="antialiased relative flex h-full overflow-hidden bg-[#FAFAFA]">
      {/* --------------------------------------------------------- Map */}
      <section
        ref={mapSectionRef}
        className="explorer-map relative min-w-0 flex-1 overflow-hidden"
      >
        <MapCanvas />
        <MapToolbar />
        <MapLegend />

        {/* Panel launchers, below 1024px */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex items-center justify-between gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => openPanelFrom("map")}
            className={launcherClass}
            aria-controls="explorer-map-panel"
            aria-expanded={openPanel === "map"}
          >
            <Layers className="h-4 w-4 text-[#6B6B6B]" strokeWidth={1.75} />
            Map key
          </button>

          <button
            type="button"
            onClick={() => openPanelFrom("reasoning")}
            className={launcherClass}
            aria-controls="explorer-reasoning-panel"
            aria-expanded={openPanel === "reasoning"}
          >
            Reasoning
            {selectedH3 && (
              <span className="h-2 w-2 rounded-full bg-[#1A1A1A]" aria-hidden="true" />
            )}
            <PanelRightOpen className="h-4 w-4 text-[#6B6B6B]" strokeWidth={1.75} />
          </button>
        </div>
      </section>

      {/* ---------------------------------------------------- Backdrop */}
      <div
        className={`absolute inset-0 z-30 bg-black/30 transition-opacity duration-300 lg:hidden ${
          openPanel ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closePanel}
        aria-hidden="true"
      />

      {/* ------------------------------------------ Left panel: map key */}
      <aside
        ref={mapPanelRef}
        id="explorer-map-panel"
        aria-label="Map key"
        tabIndex={-1}
        className={`absolute inset-y-0 left-0 z-40 flex w-[min(22rem,calc(100%-3rem))] flex-col bg-[#FAF7EF] shadow-2xl outline-none lg:hidden ${
          openPanel === "map" ? PANEL_OPEN : `${PANEL_CLOSED} -translate-x-full`
        }`}
      >
        <PanelHeader
          title="Map"
          subtitle="Layers and SPI-3 classes"
          onClose={closePanel}
        />

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
          <LayerSelector embedded />

          <section className="border-t border-[#D8CEB8] pt-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#7C6A45]">
              SPI-3 Classification
            </h2>
            <LegendKey />
          </section>
        </div>
      </aside>

      {/* ----------------------------------------- Right panel: reasoning */}
      {/*
        Below 1024px: slide-over from the right.
        Desktop (1024px+):  fixed right sidebar, 420px wide.
        Large monitors (1280px+): 460px wide.
        Very large monitors (1536px+): 500px wide.
      */}
      <section
        ref={reasoningPanelRef}
        id="explorer-reasoning-panel"
        aria-label="Reasoning"
        tabIndex={-1}
        className={`
          absolute inset-y-0 right-0 z-40
          flex w-[min(26rem,calc(100%-3rem))] flex-col
          bg-white shadow-2xl outline-none

          ${openPanel === "reasoning" ? PANEL_OPEN : `${PANEL_CLOSED} translate-x-full`}

          lg:visible
          lg:static
          lg:z-auto
          lg:w-105
          lg:shrink-0
          lg:translate-x-0
          lg:border-l
          lg:border-[#E5E5E5]
          lg:shadow-none
          lg:[transition:none]

          xl:w-115
          2xl:w-125
        `}
      >
        <PanelHeader
          className="lg:hidden"
          title="Reasoning"
          subtitle={selectedH3 ? `Cell ${selectedH3}` : "Tap a hexagon on the map to begin"}
          onClose={closePanel}
        />

        <div className="min-h-0 flex-1 overflow-y-auto">
          <ExplorerSidebar />
        </div>
      </section>
    </div>
  );
}
