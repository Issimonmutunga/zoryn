import { useExplanation } from "@/hooks/useExplanation";
import { useReasoning } from "@/hooks/useReasoning";

import DiscoveryCard from "@/components/reasoning/DiscoveryCard";
import CollapsibleSection from "@/components/reasoning/CollapsibleSection";
import EvidenceAndBasisCard from "@/components/reasoning/EvidenceAndBasisCard";
import ExplanationSection from "@/components/reasoning/ExplanationSection";
import ReferencesMetadata from "@/components/reasoning/ReferencesMetadata";
import ReasoningChain from "@/components/reasoning/ReasoningChain";

type ReasoningPanelProps = {
  h3Id: string;
};

export default function ReasoningPanel({ h3Id }: ReasoningPanelProps) {
  const {
    data: reasoning,
    isLoading,
    isError,
  } = useReasoning(h3Id);

  const {
    data: explanation,
    isLoading: explanationLoading,
    isError: explanationError,
  } = useExplanation(h3Id, reasoning?.available !== false);

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

  if (reasoning.available === false) {
    return (
      <aside className="flex h-full w-full flex-col bg-background">
        <header className="border-b border-border px-6 py-5">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
            Reasoning Workspace
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            No Discovery
          </h2>
        </header>

        <div className="p-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">
              {reasoning.message}
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const discovery = reasoning.discovery;

  const hypothesis = reasoning.hypothesis;

  const patterns = reasoning.patterns ?? [];

  const evidence = reasoning.evidence ?? [];

  const primaryPattern = patterns[0];

  const scientificStandard =
    primaryPattern?.standard ??
    "Unknown";

  if (!discovery || !hypothesis) {
    return null;
  }

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
          Inspect the deterministic reasoning and AI-generated
          scientific explanation for the selected environmental
          discovery.
        </p>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto p-6 md:space-y-8">
        <DiscoveryCard
          discovery={discovery.name}
          confidence={discovery.confidence}
          summary={hypothesis.name}
          scientificBasis={scientificStandard}
        />

        <EvidenceAndBasisCard
          evidence={evidence}
          standard={scientificStandard}
          rule={primaryPattern?.name ?? "No rule"}
          reason={`The hypothesis "${hypothesis.name}" is supported by ${evidence.length} evidence item(s) and ${patterns.length} detected pattern(s).`}
        />

        <CollapsibleSection title="Reasoning Chain">
          <ReasoningChain />
        </CollapsibleSection>

        {explanationLoading && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Generating scientific explanation...
            </p>
          </div>
        )}

        {explanationError && (
          <div className="rounded-xl border border-destructive bg-card p-6 shadow-sm">
            <p className="text-sm text-destructive">
              Unable to generate scientific explanation.
            </p>
          </div>
        )}

        {explanation && (
          <>
            <ExplanationSection
              summary={explanation.summary}
              interpretation={explanation.interpretation}
              limitations={explanation.limitations}
              provider={explanation.provider}
              model={explanation.model}
              latencyMs={explanation.latency_ms}
              totalTokens={explanation.total_tokens}
            />

            <CollapsibleSection
              title="References & Metadata"
            >
              <ReferencesMetadata
                references={
                  explanation.references
                }
                reasoningVersion={
                  explanation.reasoning_version
                }
                generatedAt={
                  explanation.generated_at
                }
                provider={
                  explanation.provider
                }
                model={
                  explanation.model
                }
              />
            </CollapsibleSection>
          </>
        )}
      </div>
    </aside>
  );
}