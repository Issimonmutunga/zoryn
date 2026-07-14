import ConfidenceMeter from "@/components/reasoning/ConfidenceMeter";
import DiscoveryCard from "@/components/reasoning/DiscoveryCard";
import ReasoningChain from "@/components/reasoning/ReasoningChain";
import ScientificBasisCard from "@/components/reasoning/ScientificBasisCard";

type ReasoningPanelProps = {
  discovery: string;
  confidence: number;
  summary: string;
  scientificBasis: string;
};

export default function ReasoningPanel({
  discovery,
  confidence,
  summary,
  scientificBasis,
}: ReasoningPanelProps) {
  return (
    <aside className="flex h-full w-full flex-col border-l border-border bg-background">
      <header className="border-b border-border px-6 py-5">
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
          Reasoning Workspace
        </p>

        <h2 className="mt-2 text-xl font-semibold">
          Environmental Reasoning
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Inspect the scientific reasoning behind the selected environmental
          discovery. The workspace is organised around evidence,
          explainability, and scientific traceability.
        </p>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <DiscoveryCard
          discovery={discovery}
          confidence={confidence}
          summary={summary}
          scientificBasis={scientificBasis}
        />

        <ConfidenceMeter confidence={confidence} />

        <ReasoningChain />

        <ScientificBasisCard
          standard={scientificBasis}
          rule="Persistent Dryness Rule"
          reason="Three consecutive decreases in SPI indicate persistent precipitation deficits consistent with developing meteorological drought."
        />
      </div>
    </aside>
  );
}