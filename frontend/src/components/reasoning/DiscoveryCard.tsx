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
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <header className="space-y-2">
        <p className="text-primary text-sm font-semibold uppercase tracking-wide">
          Discovery
        </p>

        <h2 className="text-3xl font-semibold text-foreground">
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

        <div className="bg-muted h-3 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{
              width: `${confidencePercent}%`,
            }}
          />
        </div>
      </section>

      <section className="mt-8 space-y-2">
        <h3 className="text-primary text-sm font-semibold uppercase tracking-wide">
          Summary
        </h3>

        <p className="text-muted-foreground leading-7">
          {summary}
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h3 className="text-primary text-sm font-semibold uppercase tracking-wide">
          Scientific Basis
        </h3>

        <p className="font-medium">
          {scientificBasis}
        </p>
      </section>
    </section>
  );
}