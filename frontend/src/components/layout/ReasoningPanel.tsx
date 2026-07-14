import type { DiscoveryDetail } from "@/services/api/discoveries";

import ConfidenceMeter from "@/components/reasoning/ConfidenceMeter";
import DiscoveryCard from "@/components/reasoning/DiscoveryCard";
import ReasoningChain from "@/components/reasoning/ReasoningChain";
import ScientificBasisCard from "@/components/reasoning/ScientificBasisCard";

type ReasoningPanelProps = {
  discovery: DiscoveryDetail;
};

export default function ReasoningPanel({
  discovery,
}: ReasoningPanelProps) {
  return (
    <aside className="flex h-full w-full flex-col bg-background">
      <header className="border-b border-border px-6 py-5">
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
          Reasoning Workspace
        </p>

        <h2 className="mt-2 text-xl font-semibold">
          Environmental Reasoning
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Inspect the scientific reasoning behind the selected environmental
          discovery. Every conclusion is supported by evidence, reasoning,
          and scientific guidance.
        </p>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <DiscoveryCard
          discovery={discovery.name}
          confidence={discovery.confidence}
          summary={`${discovery.start} → ${discovery.end}`}
          scientificBasis="WMO Standardized Precipitation Index (SPI)"
        />

        <ConfidenceMeter
          confidence={discovery.confidence}
        />

        <ReasoningChain />

        <ScientificBasisCard
          standard="WMO Standardized Precipitation Index (SPI)"
          rule="Persistent Dryness Rule"
          reason="Three consecutive decreases in SPI indicate persistent precipitation deficits consistent with developing meteorological drought."
        />
      </div>
    </aside>
  );
}