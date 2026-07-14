type RelationshipCardProps = {
  source: string;
  target: string;
  relationship: string;
};

export default function RelationshipCard({
  source,
  target,
  relationship,
}: RelationshipCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Relationship
      </h2>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Source
          </p>

          <p className="mt-1 font-medium">
            {source}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Relationship
          </p>

          <p className="mt-1 font-medium">
            {relationship}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Target
          </p>

          <p className="mt-1 font-medium">
            {target}
          </p>
        </div>
      </div>
    </section>
  );
}