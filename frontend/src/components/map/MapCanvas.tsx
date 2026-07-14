import { Layers, Map as MapIcon } from "lucide-react";

import LayerSelector from "@/components/map/LayerSelector";
import MapToolbar from "@/components/map/MapToolbar";

export default function MapCanvas() {
  return (
    <section className="relative flex h-full w-full overflow-hidden rounded-lg border border-border bg-card">
      <div className="absolute left-4 top-4 z-20">
        <MapToolbar />
      </div>

      <div className="absolute right-4 top-4 z-20">
        <LayerSelector />
      </div>

      <div className="flex h-full w-full items-center justify-center bg-muted/30">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-border bg-background">
            <MapIcon className="h-10 w-10 text-muted-foreground" />
          </div>

          <h2 className="text-xl font-semibold">
            Interactive Environmental Map
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This workspace will display H3 environmental discoveries,
            administrative boundaries and future environmental layers. Selecting
            an H3 cell will populate the Reasoning Workspace without obscuring
            the spatial context.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
            <Layers className="h-4 w-4" />
            MapLibre integration coming next
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 rounded-md border border-border bg-background/95 px-3 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur">
        Ready
      </div>
    </section>
  );
}