import ReasoningPanel from "@/components/layout/ReasoningPanel";

export default function ExplorerSidebar() {
  return (
    <aside className="w-105 overflow-y-auto border-l border-border bg-background">
      <ReasoningPanel
        discovery="Developing Meteorological Drought"
        confidence={0.87}
        summary="Persistent precipitation deficits indicate emerging meteorological drought conditions within the selected H3 cell."
        scientificBasis="WMO SPI User Guide"
      />
    </aside>
  );
}