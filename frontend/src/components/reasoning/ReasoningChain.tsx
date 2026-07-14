const steps = [
  "Observation",
  "Signature",
  "Relationship",
  "Evidence",
  "Pattern",
  "Hypothesis",
  "Discovery",
];

export default function ReasoningChain() {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Reasoning Chain
      </h2>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex items-center gap-3"
          >
            <div className="rounded-lg border border-border bg-background px-4 py-2">
              <p className="text-sm font-medium">
                {step}
              </p>
            </div>

            {index < steps.length - 1 && (
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