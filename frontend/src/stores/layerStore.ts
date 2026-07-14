import { create } from "zustand";

export type MapLayer =
  | "discoveries"
  | "administrativeBoundaries"
  | "basemap";

export interface LayerState {
  visibleLayers: Record<MapLayer, boolean>;

  toggleLayer: (layer: MapLayer) => void;
  setLayerVisibility: (layer: MapLayer, visible: boolean) => void;
  showAllLayers: () => void;
  hideAllLayers: () => void;
  reset: () => void;
}

const defaultLayers: Record<MapLayer, boolean> = {
  discoveries: true,
  administrativeBoundaries: true,
  basemap: true,
};

export const useLayerStore = create<LayerState>((set) => ({
  visibleLayers: defaultLayers,

  toggleLayer: (layer) =>
    set((state) => ({
      visibleLayers: {
        ...state.visibleLayers,
        [layer]: !state.visibleLayers[layer],
      },
    })),

  setLayerVisibility: (layer, visible) =>
    set((state) => ({
      visibleLayers: {
        ...state.visibleLayers,
        [layer]: visible,
      },
    })),

  showAllLayers: () =>
    set({
      visibleLayers: {
        discoveries: true,
        administrativeBoundaries: true,
        basemap: true,
      },
    }),

  hideAllLayers: () =>
    set({
      visibleLayers: {
        discoveries: false,
        administrativeBoundaries: false,
        basemap: false,
      },
    }),

  reset: () =>
    set({
      visibleLayers: defaultLayers,
    }),
}));