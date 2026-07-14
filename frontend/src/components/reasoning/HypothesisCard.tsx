type HypothesisCardProps = {
  hypothesis: string;
  confidence: number;
};

export default function HypothesisCard({
  hypothesis,
  confidence,
}: HypothesisCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Hypothesis
      </h2>

      <p className="mt-4 text-lg font-semibold">
        {hypothesis}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">
          Confidence
        </span>

        <span className="text-primary text-sm font-semibold">
          {Math.round(confidence * 100)}%
        </span>
      </div>
    </section>
  );
}