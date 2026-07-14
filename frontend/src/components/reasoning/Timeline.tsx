type TimelineProps = {
  current: string;
};

export default function Timeline({
  current,
}: TimelineProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Timeline
      </h2>

      <div className="mt-6">
        <input
          type="range"
          min={0}
          max={100}
          defaultValue={100}
          className="w-full"
        />

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            2002
          </span>

          <span className="text-sm font-medium">
            {current}
          </span>

          <span className="text-sm text-muted-foreground">
            2024
          </span>
        </div>
      </div>
    </section>
  );
}