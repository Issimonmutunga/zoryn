import ExplorerSidebar from "@/components/layout/ExplorerSidebar";
import MapCanvas from "@/components/map/MapCanvas";

export default function ExplorerPage() {
  return (
    <main className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      <section className="flex-[7] border-r border-border">
        <MapCanvas />
      </section>

      <section className="flex w-[420px] min-w-[380px] max-w-[460px]">
        <ExplorerSidebar />
      </section>
    </main>
  );
}