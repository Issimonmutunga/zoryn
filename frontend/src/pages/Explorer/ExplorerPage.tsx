import DiscoveryCard from "@/components/reasoning/DiscoveryCard";

export default function ExplorerPage() {
  return (
    <main className="mx-auto flex h-[calc(100vh-64px)] max-w-[1600px]">
      <section className="flex-1 border-r border-border bg-muted/20">
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">
            Map (Coming Soon)
          </p>
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