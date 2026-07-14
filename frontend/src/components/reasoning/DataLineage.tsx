const stages = [
  "Observation",
  "Relationship",
  "Evidence",
  "Pattern",
  "Hypothesis",
  "Discovery",
];

export default function DataLineage() {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Data Lineage
      </h2>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {stages.map((stage, index) => (
          <div
            key={stage}
            className="flex items-center gap-3"
          >
            <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
              {stage}
            </button>

            {index < stages.length - 1 && (
              <span className="text-muted-foreground">
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}