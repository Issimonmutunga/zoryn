const items = [
  {
    label: "Observation",
    color: "bg-slate-500",
  },
  {
    label: "Evidence",
    color: "bg-blue-500",
  },
  {
    label: "Pattern",
    color: "bg-amber-500",
  },
  {
    label: "Hypothesis",
    color: "bg-violet-500",
  },
  {
    label: "Discovery",
    color: "bg-emerald-600",
  },
];

export default function ReasoningLegend() {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Legend
      </h2>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3"
          >
            <span
              className={`h-3 w-3 rounded-full ${item.color}`}
            />

            <span className="text-sm">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}