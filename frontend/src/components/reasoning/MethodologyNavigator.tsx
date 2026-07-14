const stages = [
  "Observation",
  "Signature",
  "Relationship",
  "Evidence",
  "Pattern",
  "Hypothesis",
  "Discovery",
];

type MethodologyNavigatorProps = {
  activeStage?: string;
};

export default function MethodologyNavigator({
  activeStage,
}: MethodologyNavigatorProps) {
  return (
    <nav className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Methodology
      </h2>

      <div className="mt-6 flex flex-wrap gap-2">
        {stages.map((stage) => (
          <button
            key={stage}
            className={
              stage === activeStage
                ? "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                : "rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            }
          >
            {stage}
          </button>
        ))}
      </div>
    </nav>
  );
}