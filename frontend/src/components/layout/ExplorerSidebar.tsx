import { useDiscovery } from "@/hooks/useDiscoveries";
import { useExplorerStore } from "@/stores/explorerStore";

import ReasoningPanel from "@/components/layout/ReasoningPanel";

export default function ExplorerSidebar() {
  const selectedH3 = useExplorerStore(
    (state) => state.selectedH3,
  );

  const {
    data: discovery,
    isLoading,
    isError,
  } = useDiscovery(
    selectedH3 ?? "",
    Boolean(selectedH3),
  );

  if (!selectedH3) {
    return (
      <aside className="flex h-full w-[420px] items-center justify-center border-l border-border bg-background p-6">
        <div className="space-y-3 text-center">
          <h2 className="text-lg font-semibold">
            Environmental Reasoning
          </h2>

          <p className="text-sm text-muted-foreground">
            Select an H3 cell on the map to inspect its environmental
            reasoning.
          </p>
        </div>
      </aside>
    );
  }

  if (isLoading) {
    return (
      <aside className="flex h-full w-[420px] items-center justify-center border-l border-border bg-background">
        <p className="text-sm text-muted-foreground">
          Loading reasoning...
        </p>
      </aside>
    );
  }

  if (isError || !discovery) {
    return (
      <aside className="flex h-full w-[420px] items-center justify-center border-l border-border bg-background">
        <p className="text-sm text-destructive">
          Unable to load reasoning.
        </p>
      </aside>
    );
  }

  return (
    <aside className="h-full w-[420px] border-l border-border bg-background">
      <ReasoningPanel
        discovery={discovery.name ?? discovery.discovery}
        confidence={discovery.confidence}
        summary={`Observation period: ${discovery.start} – ${discovery.end}`}
        scientificBasis="WMO SPI"
      />
    </aside>
  );
}