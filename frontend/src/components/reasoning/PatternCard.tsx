type PatternCardProps = {
  pattern: string;
  frequency: number;
};

export default function PatternCard({
  pattern,
  frequency,
}: PatternCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Pattern
      </h2>

      <p className="mt-4 text-lg font-semibold">
        {pattern}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">
          Frequency
        </span>

        <span className="text-primary text-sm font-semibold">
          {frequency}
        </span>
      </div>
    </section>
  );
}