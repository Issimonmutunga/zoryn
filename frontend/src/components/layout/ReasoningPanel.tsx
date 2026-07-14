import { useReasoning } from "@/hooks/useReasoning";

import ConfidenceMeter from "@/components/reasoning/ConfidenceMeter";
import DiscoveryCard from "@/components/reasoning/DiscoveryCard";
import EvidenceList from "@/components/reasoning/EvidenceList";
import ReasoningChain from "@/components/reasoning/ReasoningChain";
import ScientificBasisCard from "@/components/reasoning/ScientificBasisCard";

type ReasoningPanelProps = {
  h3Id: string;
};

export default function ReasoningPanel({
  h3Id,
}: ReasoningPanelProps) {
  const {
    data: reasoning,
    isLoading,
    isError,
  } = useReasoning(h3Id);

  if (isLoading) {
    return (
      <aside className="flex h-full w-full items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading reasoning...
        </p>
      </aside>
    );
  }

  if (isError || !reasoning) {
    return (
      <aside className="flex h-full w-full items-center justify-center">
        <p className="text-sm text-destructive">
          Unable to load reasoning.
        </p>
      </aside>
    );
  }

  const discovery = reasoning.discovery;
  const hypothesis = reasoning.hypothesis;

  const primaryPattern =
    reasoning.patterns[0];

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
          Inspect the scientific reasoning behind the selected
          environmental discovery.
        </p>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <DiscoveryCard
          discovery={discovery.name}
          confidence={discovery.confidence}
          summary={hypothesis.name}
          scientificBasis={
            primaryPattern?.standard ??
            "Scientific Standard"
          }
        />

        <ConfidenceMeter
          confidence={
            discovery.confidence
          }
        />

        <ReasoningChain />

        <EvidenceList
          evidence={reasoning.evidence.map(
            (item) => ({
              variable:
                item.variable,
              value: `${item.direction} (${item.strength})`,
            }),
          )}
        />

        <ScientificBasisCard
          standard={
            primaryPattern?.standard ??
            "Scientific Standard"
          }
          rule={
            primaryPattern?.name ??
            "No rule"
          }
          reason={`The hypothesis "${hypothesis.name}" is supported by ${reasoning.evidence.length} evidence item(s) and ${reasoning.patterns.length} detected pattern(s).`}
        />
      </div>
    </aside>
  );
}