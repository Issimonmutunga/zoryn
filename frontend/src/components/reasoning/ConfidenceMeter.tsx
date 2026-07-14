type ConfidenceMeterProps = {
  confidence: number;
};

export default function ConfidenceMeter({
  confidence,
}: ConfidenceMeterProps) {
  const percentage = Math.round(
    confidence * 100,
  );

  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Confidence
      </h2>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">
            Reasoning Confidence
          </span>

          <span className="text-primary font-semibold">
            {percentage}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}