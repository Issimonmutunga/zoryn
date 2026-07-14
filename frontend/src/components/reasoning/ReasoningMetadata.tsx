type ReasoningMetadataProps = {
  h3Id: string;
  generatedAt: string;
  engineVersion: string;
};

export default function ReasoningMetadata({
  h3Id,
  generatedAt,
  engineVersion,
}: ReasoningMetadataProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Metadata
      </h2>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            H3 Cell
          </p>

          <p className="mt-1 font-medium">
            {h3Id}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Generated
          </p>

          <p className="mt-1 font-medium">
            {generatedAt}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Engine
          </p>

          <p className="mt-1 font-medium">
            {engineVersion}
          </p>
        </div>
      </div>
    </section>
  );
}