type DiscoverySummaryProps = {
  discovery: string;
  confidence: number;
  evidenceCount: number;
  patternCount: number;
  hypothesisCount: number;
};

export default function DiscoverySummary({
  discovery,
  confidence,
  evidenceCount,
  patternCount,
  hypothesisCount,
}: DiscoverySummaryProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Discovery Summary
      </h2>

      <p className="mt-4 text-xl font-semibold">
        {discovery}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Confidence
          </p>

          <p className="mt-1 font-medium">
            {Math.round(confidence * 100)}%
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Evidence
          </p>

          <p className="mt-1 font-medium">
            {evidenceCount}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Patterns
          </p>

          <p className="mt-1 font-medium">
            {patternCount}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Hypotheses
          </p>

          <p className="mt-1 font-medium">
            {hypothesisCount}
          </p>
        </div>
      </div>
    </section>
  );
}