import { create } from "zustand";

export interface SearchTarget {
  name: string;
  latitude: number;
  longitude: number;
}

export interface ExplorerState {
  selectedH3: string | null;
  selectedTimestamp: string | null;

  searchQuery: string;
  searchTarget: SearchTarget | null;

  isReasoningPanelOpen: boolean;

  isReasoningLoading: boolean;

  setSelectedH3: (
    h3: string | null,
  ) => void;

  setSelectedTimestamp: (
    timestamp: string | null,
  ) => void;

  setSearchQuery: (
    query: string,
  ) => void;

  setSearchTarget: (
    target: SearchTarget | null,
  ) => void;

  setReasoningPanelOpen: (
    open: boolean,
  ) => void;

  setIsReasoningLoading: (
    loading: boolean,
  ) => void;

  resetSelection: () => void;
}

export const useExplorerStore =
  create<ExplorerState>(
    (set) => ({
      selectedH3: null,

      selectedTimestamp: null,

      searchQuery: "",

      searchTarget: null,

      isReasoningPanelOpen: true,

      isReasoningLoading: false,

      setSelectedH3: (
        selectedH3,
      ) =>
        set({
          selectedH3,
        }),

      setSelectedTimestamp: (
        selectedTimestamp,
      ) =>
        set({
          selectedTimestamp,
        }),

      setSearchQuery: (
        searchQuery,
      ) =>
        set({
          searchQuery,
        }),

      setSearchTarget: (
        searchTarget,
      ) =>
        set({
          searchTarget,
        }),

      setReasoningPanelOpen: (
        isReasoningPanelOpen,
      ) =>
        set({
          isReasoningPanelOpen,
        }),

      setIsReasoningLoading: (
        isReasoningLoading,
      ) =>
        set({
          isReasoningLoading,
        }),

      resetSelection: () =>
        set({
          selectedH3: null,
          selectedTimestamp: null,
          searchQuery: "",
          searchTarget: null,
        }),
    }),
  );