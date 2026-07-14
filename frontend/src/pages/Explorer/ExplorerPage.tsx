import DiscoveryCard from "@/components/reasoning/DiscoveryCard";

export default function ExplorerPage() {
  return (
    <main className="mx-auto flex h-[calc(100vh-64px)] w-full max-w-[1600px]">
      <section className="flex-1 border-r border-border bg-muted/20">
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground text-lg">
            Interactive Map
          </p>
        </div>
      </section>

      <aside className="w-[420px] overflow-y-auto bg-background p-6">
        <DiscoveryCard
          discovery="Developing Meteorological Drought"
          confidence={0.87}
          summary={
            "Persistent precipitation deficits and declining SPI indicate the emergence of meteorological drought conditions within the selected H3 cell."
          }
          scientificBasis="WMO SPI User Guide"
        />
      </aside>
    </main>
  );
}