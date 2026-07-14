type FutureWorkCardProps = {
  items: string[];
};

export default function FutureWorkCard({
  items,
}: FutureWorkCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Future Work
      </h2>

      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-lg border border-border p-3 text-sm text-muted-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}