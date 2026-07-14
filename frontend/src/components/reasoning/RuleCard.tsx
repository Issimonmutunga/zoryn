type RuleCardProps = {
  name: string;
  standard: string;
  description: string;
};

export default function RuleCard({
  name,
  standard,
  description,
}: RuleCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Applied Rule
      </h2>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Rule
          </p>

          <p className="mt-1 font-medium">
            {name}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Scientific Standard
          </p>

          <p className="mt-1 font-medium">
            {standard}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Description
          </p>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}