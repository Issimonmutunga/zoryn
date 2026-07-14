type DiscoveryCardProps = {
  discovery: string;
  confidence: number;
  summary: string;
  scientificBasis: string;
};

export default function DiscoveryCard({
  discovery,
  confidence,
  summary,
  scientificBasis,
}: DiscoveryCardProps) {
  const confidencePercent = Math.round(
    confidence * 100,
  );

  return (
    <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <header>
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
          Discovery
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          {discovery}
        </h2>
      </header>

      <section className="mt-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">
            Reasoning Confidence
          </span>

          <span className="text-primary font-semibold">
            {confidencePercent}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{
              width: `${confidencePercent}%`,
            }}
          />
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
          Summary
        </h3>

        <p className="mt-3 leading-7 text-muted-foreground">
          {summary}
        </p>
      </section>

      <section className="mt-8">
        <h3 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
          Scientific Basis
        </h3>

        <p className="mt-3 font-medium">
          {scientificBasis}
        </p>
      </section>
    </article>
  );
}