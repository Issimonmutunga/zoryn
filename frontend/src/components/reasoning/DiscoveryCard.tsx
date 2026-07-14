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
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <header className="border-b border-border px-6 py-5">
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
          Discovery
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          {discovery}
        </h2>
      </header>

      <div className="space-y-6 p-6">
        <section>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">
              Confidence
            </span>

            <span className="text-primary font-semibold">
              {confidencePercent}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${confidencePercent}%`,
              }}
            />
          </div>
        </section>

        <section>
          <h3 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
            Summary
          </h3>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {summary}
          </p>
        </section>

        <section>
          <h3 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
            Scientific Basis
          </h3>

          <div className="mt-3 rounded-lg bg-muted/40 p-3">
            <p className="text-sm font-medium">
              {scientificBasis}
            </p>
          </div>
        </section>
      </div>
    </article>
  );
}