import { create } from "zustand";

export interface ExplorerState {
  selectedH3: string | null;
  selectedTimestamp: string | null;
  searchQuery: string;
  isReasoningPanelOpen: boolean;

  setSelectedH3: (h3: string | null) => void;
  setSelectedTimestamp: (timestamp: string | null) => void;
  setSearchQuery: (query: string) => void;
  setReasoningPanelOpen: (open: boolean) => void;
  resetSelection: () => void;
}

export const useExplorerStore = create<ExplorerState>((set) => ({
  selectedH3: null,
  selectedTimestamp: null,
  searchQuery: "",
  isReasoningPanelOpen: true,

  setSelectedH3: (selectedH3) =>
    set({
      selectedH3,
    }),

  setSelectedTimestamp: (selectedTimestamp) =>
    set({
      selectedTimestamp,
    }),

  setSearchQuery: (searchQuery) =>
    set({
      searchQuery,
    }),

  setReasoningPanelOpen: (isReasoningPanelOpen) =>
    set({
      isReasoningPanelOpen,
    }),

  resetSelection: () =>
    set({
      selectedH3: null,
      selectedTimestamp: null,
    }),
}));