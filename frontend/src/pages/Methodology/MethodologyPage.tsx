const methodology = [
  "Observation",
  "Environmental Signature",
  "Relationship",
  "Evidence",
  "Pattern",
  "Hypothesis",
  "Discovery",
];

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-7xl px-8 py-12">
      <header className="mb-12">
        <h1 className="text-primary text-4xl font-bold">
          Methodology
        </h1>

        <p className="mt-4 max-w-4xl text-muted-foreground">
          Every discovery follows a deterministic environmental reasoning
          workflow that can be inspected from the original observations to the
          final conclusion.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-7">
        {methodology.map((step, index) => (
          <article
            key={step}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
              Step {index + 1}
            </p>

            <h2 className="mt-3 text-lg font-semibold">
              {step}
            </h2>
          </article>
        ))}
      </section>
    </main>
  );
}