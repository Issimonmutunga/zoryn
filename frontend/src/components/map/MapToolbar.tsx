import { useEffect, useMemo, useRef, useState } from "react";

import {
  CalendarDays,
  FileText,
  Layers,
  Search,
} from "lucide-react";

import { searchLocation } from "@/services/geocoding/geocoding";
import { useExplorerStore } from "@/stores/explorerStore";
import { useTimelineStore } from "@/stores/timelineStore";
import { useDiscoveryTimeline } from "@/hooks/useDiscoveries";
import LayerSelector from "@/components/map/LayerSelector";

function formatMonth(
  value: string,
): string {

  const [
    year,
    month,
  ] = value.split("-");

  const date =
    new Date(
      Number(year),
      Number(month) - 1,
      1,
    );

  return date.toLocaleString(
    "en",
    {
      month: "long",
      year: "numeric",
    },
  );

}

export default function MapToolbar() {
  const searchQuery =
    useExplorerStore(
      (state) => state.searchQuery,
    );

  const setSearchQuery =
    useExplorerStore(
      (state) => state.setSearchQuery,
    );

  const setSearchTarget =
    useExplorerStore(
      (state) => state.setSearchTarget,
    );

  const selectedDate =
    useTimelineStore(
      (state) => state.selectedDate,
    );

  const availableDates =
    useTimelineStore(
      (state) => state.availableDates,
    );

  const setSelectedDate =
    useTimelineStore(
      (state) => state.setSelectedDate,
    );

  const [
    timelineOpen,
    setTimelineOpen,
  ] = useState(false);

  const [
    layersOpen,
    setLayersOpen,
  ] = useState(false);

  const toolbarRef = useRef<HTMLElement>(null);

  const { data: timeline = [] } = useDiscoveryTimeline();

  const discoveryLookup = useMemo(
    () =>
      new Map(
        timeline.map(item => [
          item.timestamp,
          item.discoveries,
        ]),
      ),
    [timeline],
  );

  const selectedCount =
    selectedDate
      ? discoveryLookup.get(selectedDate) ?? 0
      : 0;

  useEffect(() => {

    if (!timelineOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {

      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node)
      ) {
        setTimelineOpen(false);
      }

    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [timelineOpen]);

  useEffect(() => {

    if (!timelineOpen) {
      return;
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {

      if (
        event.key === "Escape"
      ) {

        setTimelineOpen(false);

      }

    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {

      document.removeEventListener(
        "keydown",
        handleEscape,
      );

    };

  }, [timelineOpen]);

  async function handleSearch() {
    try {
      const result =
        await searchLocation(
          searchQuery,
        );

      if (!result) {
        alert(
          "Location not found.",
        );
        return;
      }

      setSearchTarget(
        result,
      );
    } catch (error) {
      console.error(
        "Search failed:",
        error,
      );

      alert(
        "Unable to search for the requested location.",
      );
    }
  }

  return (
    <section
      ref={toolbarRef}
      className="absolute left-16 right-3 top-3 z-20 sm:left-16 sm:right-4 sm:top-4"
    >
      <div className="flex items-center gap-1.5 rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF]/90 p-1.5 shadow-[0_8px_24px_rgba(43,36,23,0.10)] backdrop-blur-md sm:gap-2 sm:p-2">

        <div className="relative min-w-0 flex-1">

          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A7B5C]" />

          <input
            type="text"
            value={searchQuery}
            placeholder="Search Nairobi location..."
            onChange={(event) =>
              setSearchQuery(
                event.target.value,
              )
            }
            onKeyDown={(event) => {
              if (
                event.key ===
                "Enter"
              ) {
                void handleSearch();
              }
            }}
            className="h-10 w-full rounded-xl border border-[#D8CEB8] bg-[#F3EEE2] pl-9 pr-3 text-sm text-[#2B2417] outline-none transition-colors placeholder:text-[#8A7B5C] focus:border-[#5B6B45]"
          />

        </div>

        <button
          type="button"
          aria-expanded={timelineOpen}
          aria-haspopup="listbox"
          onClick={() => {
            setTimelineOpen(!timelineOpen);
            setLayersOpen(false);
          }}
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-[#D8CEB8] bg-[#F3EEE2] px-2.5 text-sm text-[#4A422F] transition-colors hover:bg-[#EDE6D3] sm:px-3"
        >
          <CalendarDays className="h-4 w-4" />
          <span className="hidden sm:inline">
            {selectedDate
              ? `${formatMonth(selectedDate)} • ${selectedCount}`
              : "Time"}
          </span>
        </button>

        <button
          type="button"
          disabled
          className="hidden h-10 shrink-0 items-center gap-2 rounded-xl border border-[#D8CEB8] bg-[#F3EEE2] px-3 text-sm text-[#4A422F] transition-colors hover:bg-[#EDE6D3] disabled:cursor-not-allowed disabled:opacity-60 md:flex"
        >
          <FileText className="h-4 w-4" />
          Export
        </button>

        <button
          type="button"
          onClick={() => {
            setLayersOpen(!layersOpen);
            setTimelineOpen(false);
          }}
          aria-label="Layers"
          aria-expanded={layersOpen}
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-[#D8CEB8] bg-[#F3EEE2] px-2.5 text-sm text-[#4A422F] transition-colors hover:bg-[#EDE6D3] sm:px-3"
        >
          <Layers className="h-4 w-4" />
          <span className="hidden sm:inline">Layers</span>
        </button>

      </div>

      {timelineOpen && (
        <div className="absolute right-0 top-14 max-h-80 w-56 max-w-full overflow-y-auto rounded-xl border border-[#D8CEB8] bg-[#FAF7EF] p-1.5 shadow-[0_8px_24px_rgba(43,36,23,0.12)]">

          {availableDates.length === 0 && (
            <div className="p-2 text-sm text-[#8A7B5C]">
              Loading...
            </div>
          )}

          {availableDates.map((date) => {

            const count =
              discoveryLookup.get(date) ?? 0;

            const isSelected =
              date === selectedDate;

            return (

              <button
                key={date}
                type="button"
                title={
                  count > 0
                    ? `${count} discoveries`
                    : "No discoveries"
                }
                onClick={() => {
                  setSelectedDate(date);
                  setTimelineOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm text-[#2B2417] hover:bg-[#EDE6D3] ${
                  isSelected ? "bg-[#EDE6D3] font-medium" : ""
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      count > 0 ? "bg-[#5B6B45]" : "bg-[#D8CEB8]"
                    }`}
                  />
                  {formatMonth(date)}
                </span>

                <span className="text-xs text-[#8A7B5C]">
                  {count > 0
                    ? count.toLocaleString()
                    : "—"}
                </span>
              </button>

            );

          })}

        </div>
      )}

      {layersOpen && (

        <div className="absolute right-0 top-14 w-72 max-w-full animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">

          <LayerSelector />

        </div>

      )}
    </section>
  );
}