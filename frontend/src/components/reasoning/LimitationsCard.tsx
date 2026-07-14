type LimitationsCardProps = {
  limitations: string[];
};

export default function LimitationsCard({
  limitations,
}: LimitationsCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Limitations
      </h2>

      <ul className="mt-6 space-y-3">
        {limitations.map((limitation) => (
          <li
            key={limitation}
            className="rounded-lg border border-border p-3 text-sm text-muted-foreground"
          >
            {limitation}
          </li>
        ))}
      </ul>
    </section>
  );
}