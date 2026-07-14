type EnvironmentalContextCardProps = {
  location: string;
  period: string;
  variable: string;
};

export default function EnvironmentalContextCard({
  location,
  period,
  variable,
}: EnvironmentalContextCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Environmental Context
      </h2>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Location
          </p>

          <p className="mt-1 font-medium">
            {location}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Period
          </p>

          <p className="mt-1 font-medium">
            {period}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Variable
          </p>

          <p className="mt-1 font-medium">
            {variable}
          </p>
        </div>
      </div>
    </section>
  );
}