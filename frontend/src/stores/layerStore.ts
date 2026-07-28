import { create } from "zustand";

export type MapLayer =
  | "spi"
  | "discoveryHighlights";

export interface LayerState {
  visibleLayers: Record<
    MapLayer,
    boolean
  >;

  toggleLayer: (
    layer: MapLayer,
  ) => void;

  setLayerVisibility: (
    layer: MapLayer,
    visible: boolean,
  ) => void;

  showAllLayers: () => void;

  hideAllLayers: () => void;

  reset: () => void;
}

const defaultLayers: Record<
  MapLayer,
  boolean
> = {
  spi: true,
  discoveryHighlights: true,
};

export const useLayerStore =
  create<LayerState>(
    (set) => ({

      visibleLayers:
        defaultLayers,

      toggleLayer: (
        layer,
      ) =>
        set(
          (state) => ({
            visibleLayers: {
              ...state.visibleLayers,
              [layer]:
                !state
                  .visibleLayers[
                  layer
                ],
            },
          }),
        ),

      setLayerVisibility: (
        layer,
        visible,
      ) =>
        set(
          (state) => ({
            visibleLayers: {
              ...state.visibleLayers,
              [layer]:
                visible,
            },
          }),
        ),

      showAllLayers: () =>
        set({
          visibleLayers: {
            spi: true,
            discoveryHighlights: true,
          },
        }),

      hideAllLayers: () =>
        set({
          visibleLayers: {
            spi: false,
            discoveryHighlights: false,
          },
        }),

      reset: () =>
        set({
          visibleLayers:
            defaultLayers,
        }),

    }),
  );