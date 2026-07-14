import { create } from "zustand";

export interface TimelineState {
  availableDates: string[];
  selectedDate: string | null;
  isPlaying: boolean;
  playbackSpeed: number;

  setAvailableDates: (dates: string[]) => void;
  setSelectedDate: (date: string | null) => void;
  setPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;

  nextDate: () => void;
  previousDate: () => void;
  reset: () => void;
}

export const useTimelineStore = create<TimelineState>((set, get) => ({
  availableDates: [],
  selectedDate: null,
  isPlaying: false,
  playbackSpeed: 1,

  setAvailableDates: (availableDates) =>
    set((state) => ({
      availableDates,
      selectedDate:
        state.selectedDate ??
        (availableDates.length > 0 ? availableDates[0] : null),
    })),

  setSelectedDate: (selectedDate) =>
    set({
      selectedDate,
    }),

  setPlaying: (isPlaying) =>
    set({
      isPlaying,
    }),

  setPlaybackSpeed: (playbackSpeed) =>
    set({
      playbackSpeed,
    }),

  nextDate: () => {
    const { availableDates, selectedDate } = get();

    if (!selectedDate || availableDates.length === 0) {
      return;
    }

    const index = availableDates.indexOf(selectedDate);

    if (index >= 0 && index < availableDates.length - 1) {
      set({
        selectedDate: availableDates[index + 1],
      });
    }
  },

  previousDate: () => {
    const { availableDates, selectedDate } = get();

    if (!selectedDate || availableDates.length === 0) {
      return;
    }

    const index = availableDates.indexOf(selectedDate);

    if (index > 0) {
      set({
        selectedDate: availableDates[index - 1],
      });
    }
  },

  reset: () =>
    set({
      selectedDate: null,
      isPlaying: false,
      playbackSpeed: 1,
    }),
}));