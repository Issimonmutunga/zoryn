import { useMemo } from "react";

import { useDiscoveries } from "@/hooks/useDiscoveries";
import { useExplorerStore } from "@/stores/explorerStore";

import LayerSelector from "@/components/map/LayerSelector";
import MapToolbar from "@/components/map/MapToolbar";

export default function MapCanvas() {
  const { data: discoveries = [], isLoading, isError } = useDiscoveries();

  const selectedH3 = useExplorerStore((state) => state.selectedH3);
  const setSelectedH3 = useExplorerStore((state) => state.setSelectedH3);

  const discoveryCount = useMemo(
    () => discoveries.length,
    [discoveries],
  );

  return (
    <section className="relative h-full w-full overflow-hidden bg-muted/20">
      <div className="absolute left-4 top-4 z-20">
        <MapToolbar />
      </div>

      <div className="absolute right-4 top-4 z-20">
        <LayerSelector />
      </div>

      <div className="flex h-full items-center justify-center">
        <div className="max-w-lg space-y-4 text-center">
          <h2 className="text-2xl font-semibold">
            Environmental Reasoning Map
          </h2>

          <p className="text-sm text-muted-foreground">
            This placeholder will be replaced by the MapLibre map. The data
            layer is already connected to the discovery API.
          </p>

          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Loading discoveries…
            </p>
          )}

          {isError && (
            <p className="text-sm text-destructive">
              Unable to load discovery repository.
            </p>
          )}

          {!isLoading && !isError && (
            <div className="space-y-2 rounded-lg border p-4 text-left">
              <p>
                <strong>Available discoveries:</strong> {discoveryCount}
              </p>

              <p>
                <strong>Selected H3:</strong>{" "}
                {selectedH3 ?? "None"}
              </p>

              {discoveries.length > 0 && (
                <button
                  className="rounded border px-3 py-2 text-sm"
                  onClick={() => setSelectedH3(discoveries[0].h3)}
                >
                  Select first discovery
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}