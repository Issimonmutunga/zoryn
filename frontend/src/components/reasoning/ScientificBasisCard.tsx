type ScientificBasisCardProps = {
  standard: string;
  rule: string;
  reason: string;
};

export default function ScientificBasisCard({
  standard,
  rule,
  reason,
}: ScientificBasisCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Scientific Basis
      </h2>

      <div className="mt-6 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Standard
          </p>

          <p className="mt-1 text-sm font-medium">
            {standard}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Applied Rule
          </p>

          <p className="mt-1 text-sm font-medium">
            {rule}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Reason
          </p>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {reason}
          </p>
        </div>
      </div>
    </section>
  );
}