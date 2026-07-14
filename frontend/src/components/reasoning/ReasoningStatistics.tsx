type ReasoningStatisticsProps = {
  observations: number;
  relationships: number;
  evidence: number;
  patterns: number;
  hypotheses: number;
  discoveries: number;
};

export default function ReasoningStatistics({
  observations,
  relationships,
  evidence,
  patterns,
  hypotheses,
  discoveries,
}: ReasoningStatisticsProps) {
  const statistics = [
    {
      label: "Observations",
      value: observations,
    },
    {
      label: "Relationships",
      value: relationships,
    },
    {
      label: "Evidence",
      value: evidence,
    },
    {
      label: "Patterns",
      value: patterns,
    },
    {
      label: "Hypotheses",
      value: hypotheses,
    },
    {
      label: "Discoveries",
      value: discoveries,
    },
  ];

  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Reasoning Statistics
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {statistics.map((statistic) => (
          <div
            key={statistic.label}
            className="rounded-lg border border-border p-4"
          >
            <p className="text-xs uppercase text-muted-foreground">
              {statistic.label}
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {statistic.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}