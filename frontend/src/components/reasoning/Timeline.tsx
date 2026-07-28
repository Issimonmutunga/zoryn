import { useEffect, useMemo, useRef, useState } from "react";

import { useTimelineStore } from "@/stores/timelineStore";
import { useDiscoveryTimeline } from "@/hooks/useDiscoveries";

function buildTimeline(): string[] {

  const dates: string[] = [];

  for (
    let year = 2002;
    year <= 2024;
    year++
  ) {

    for (
      let month = 1;
      month <= 12;
      month++
    ) {

      dates.push(
        `${year}-${String(month).padStart(2, "0")}`,
      );

    }

  }

  return dates;

}

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

export default function Timeline() {

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: timeline = [] } = useDiscoveryTimeline();

  const availableDates =
    useTimelineStore(
      (state) => state.availableDates,
    );

  const selectedDate =
    useTimelineStore(
      (state) => state.selectedDate,
    );

  const setAvailableDates =
    useTimelineStore(
      (state) => state.setAvailableDates,
    );

  const setSelectedDate =
    useTimelineStore(
      (state) => state.setSelectedDate,
    );

  const previousDate =
    useTimelineStore(
      (state) => state.previousDate,
    );

  const nextDate =
    useTimelineStore(
      (state) => state.nextDate,
    );

  const hasPrevious =
    useTimelineStore(
      (state) => state.hasPrevious(),
    );

  const hasNext =
    useTimelineStore(
      (state) => state.hasNext(),
    );

  useEffect(() => {

    if (
      availableDates.length === 0
    ) {

      setAvailableDates(
        buildTimeline(),
      );

    }

  }, [
    availableDates.length,
    setAvailableDates,
  ]);

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

  const index =
    selectedDate
      ? availableDates.indexOf(
          selectedDate,
        )
      : 0;

  const selectedCount =
    selectedDate
      ? (
          discoveryLookup.get(
            selectedDate,
          ) ?? 0
        ).toLocaleString()
      : "0";

  useEffect(() => {

    if (!open) return;

    function handleClickOutside(event: MouseEvent) {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }

    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [open]);

  useEffect(() => {

    if (!open) {
      return;
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {

      if (
        event.key === "Escape"
      ) {

        setOpen(false);

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

  }, [open]);

  return (

    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">

      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">

        Timeline

      </h2>

      <div className="mt-6 flex items-center justify-between">

        <button
          onClick={previousDate}
          disabled={!hasPrevious}
          className="rounded border px-3 py-1 text-sm disabled:opacity-40"
        >
          ◀
        </button>

        <div className="relative" ref={dropdownRef}>

          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={() => setOpen(
              (prev) => !prev,
            )}
            className="flex items-center gap-2 rounded border bg-background px-3 py-2 text-sm"
          >
            <span>
              {selectedDate
                ? `${formatMonth(selectedDate)} • ${selectedCount}`
                : "--"}
            </span>
            <span className="text-xs text-muted-foreground">
              ▼
            </span>
          </button>

          {open && (

            <div className="absolute z-10 mt-1 max-h-80 min-w-full overflow-y-auto rounded-xl border border-border bg-card shadow-lg">

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
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted ${
                      isSelected ? "bg-muted font-medium" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          count > 0 ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                      />
                      {formatMonth(date)}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {count > 0
                        ? count.toLocaleString()
                        : "—"}
                    </span>
                  </button>

                );

              })}

            </div>

          )}

        </div>

        <button
          onClick={nextDate}
          disabled={!hasNext}
          className="rounded border px-3 py-1 text-sm disabled:opacity-40"
        >
          ▶
        </button>

      </div>

      <input
        className="mt-6 w-full"
        type="range"
        min={0}
        max={
          Math.max(
            availableDates.length - 1,
            0,
          )
        }
        value={
          index >= 0
            ? index
            : 0
        }
        onChange={(event) => {

          const value =
            Number(
              event.target.value,
            );

          setSelectedDate(
            availableDates[
              value
            ],
          );

        }}
      />

      <div className="mt-3 flex items-center justify-between">

        <span className="text-sm text-muted-foreground">

          2002

        </span>

        <span className="text-sm font-medium">

          {selectedDate
            ? formatMonth(
                selectedDate,
              )
            : "--"}

        </span>

        <span className="text-sm text-muted-foreground">

          2024

        </span>

      </div>

    </section>

  );

}