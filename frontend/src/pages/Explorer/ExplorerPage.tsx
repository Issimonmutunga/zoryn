import DiscoveryCard from "@/components/reasoning/DiscoveryCard";

export default function ExplorerPage() {
  return (
    <main className="mx-auto flex h-[calc(100vh-64px)] max-w-7xl">
      <section className="flex flex-1 flex-col border-r border-border">
        <header className="border-b border-border px-6 py-4">
          <h1 className="text-xl font-semibold">
            Explorer
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Explore environmental reasoning across space and time.
          </p>
        </header>

        <div className="relative flex flex-1 flex-col bg-muted/20">
          <div className="flex flex-1 items-center justify-center">
            <span className="text-muted-foreground">
              Interactive Map
            </span>
          </div>

          <footer className="border-t border-border bg-background px-6 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Timeline
              </span>

              <span className="text-sm text-muted-foreground">
                January 2024
              </span>
            </div>
          </footer>
        </div>
      </section>

      <aside className="w-105 overflow-y-auto border-l border-border bg-background p-6">
        <DiscoveryCard
          discovery="Developing Meteorological Drought"
          confidence={0.87}
          summary="Persistent precipitation deficits indicate emerging meteorological drought conditions within the selected H3 cell."
          scientificBasis="WMO SPI User Guide"
        />
      </aside>
    </main>
  );
}