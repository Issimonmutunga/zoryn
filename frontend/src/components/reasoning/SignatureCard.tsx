type SignatureCardProps = {
  name: string;
  variable: string;
  value: string;
};

export default function SignatureCard({
  name,
  variable,
  value,
}: SignatureCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Environmental Signature
      </h2>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Signature
          </p>

          <p className="mt-1 font-medium">
            {name}
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

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Value
          </p>

          <p className="mt-1 font-medium">
            {value}
          </p>
        </div>
      </div>
    </section>
  );
}