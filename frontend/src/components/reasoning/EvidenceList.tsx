type EvidenceItem = {
  variable: string;
  value: string;
};

type EvidenceListProps = {
  evidence: EvidenceItem[];
};

export default function EvidenceList({
  evidence,
}: EvidenceListProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Evidence
      </h2>

      <div className="mt-6 space-y-3">
        {evidence.map((item) => (
          <div
            key={item.variable}
            className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
          >
            <span className="text-sm font-medium">
              {item.variable}
            </span>

            <span className="text-sm text-muted-foreground">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}