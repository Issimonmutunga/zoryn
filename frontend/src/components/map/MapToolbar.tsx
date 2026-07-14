import { Layers, Search, ZoomIn, ZoomOut } from "lucide-react";

export default function MapToolbar() {
  return (
    <section className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-sm">
      <button className="rounded-lg p-2 hover:bg-muted">
        <Search className="h-4 w-4" />
      </button>

      <button className="rounded-lg p-2 hover:bg-muted">
        <Layers className="h-4 w-4" />
      </button>

      <button className="rounded-lg p-2 hover:bg-muted">
        <ZoomIn className="h-4 w-4" />
      </button>

      <button className="rounded-lg p-2 hover:bg-muted">
        <ZoomOut className="h-4 w-4" />
      </button>
    </section>
  );
}