type ReasoningStatusProps = {
  status: "Running" | "Completed" | "Pending";
};

export default function ReasoningStatus({
  status,
}: ReasoningStatusProps) {
  const color =
    status === "Completed"
      ? "bg-emerald-500"
      : status === "Running"
        ? "bg-amber-500"
        : "bg-slate-400";

  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Reasoning Status
      </h2>

      <div className="mt-6 flex items-center gap-3">
        <span
          className={`h-3 w-3 rounded-full ${color}`}
        />

        <span className="font-medium">
          {status}
        </span>
      </div>
    </section>
  );
}