import {
  Layers3,
  Sparkles,
  Map,
  MapPinned,
} from "lucide-react";

import { useLayerStore } from "@/stores/layerStore";

const icons = {
  spi: Layers3,
  discoveryHighlights: Sparkles,
  administrativeBoundaries: MapPinned,
  basemap: Map,
};

interface LayerSelectorProps {
  // Drop the card frame when shown inside a panel rather than a popover.
  embedded?: boolean;
}

export default function LayerSelector({ embedded = false }: LayerSelectorProps) {

  const visibleLayers =
    useLayerStore(
      (state) => state.visibleLayers,
    );

  const toggleLayer =
    useLayerStore(
      (state) => state.toggleLayer,
    );

  return (

    <section
      className={
        embedded
          ? ""
          : "rounded-xl border border-[#DDD2BE] bg-[#FAF7EF] p-4 shadow-xl"
      }
    >

      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C6A45]">
        Map Layers
      </h2>

      <p className="mt-1 text-xs text-[#5A5240]">
        Select visible map overlays.
      </p>

      <div className="mt-4 space-y-3">

        <label className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#F6F2E8]">

          <div className="flex items-center gap-3">
            {(() => {
              const Icon = icons.spi;
              return <Icon className="h-4 w-4 text-[#7C6A45]" />;
            })()}
            <span className="text-sm text-[#2B2417]">
              SPI Layer
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={visibleLayers.spi}
            aria-label="SPI Layer"
            onClick={() => toggleLayer("spi")}
            className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-200 ${
              visibleLayers.spi
                ? "bg-[#5B6B45]"
                : "bg-[#D8CEB8]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                visibleLayers.spi
                  ? "translate-x-5"
                  : "translate-x-1"
              }`}
            />
          </button>

        </label>

        <label className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#F6F2E8]">

          <div className="flex items-center gap-3">
            {(() => {
              const Icon = icons.discoveryHighlights;
              return <Icon className="h-4 w-4 text-[#7C6A45]" />;
            })()}
            <span className="text-sm text-[#2B2417]">
              Discovery Highlights
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={visibleLayers.discoveryHighlights}
            aria-label="Discovery Highlights"
            onClick={() => toggleLayer("discoveryHighlights")}
            className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-200 ${
              visibleLayers.discoveryHighlights
                ? "bg-[#5B6B45]"
                : "bg-[#D8CEB8]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                visibleLayers.discoveryHighlights
                  ? "translate-x-5"
                  : "translate-x-1"
              }`}
            />
          </button>

        </label>

      </div>

    </section>

  );

}