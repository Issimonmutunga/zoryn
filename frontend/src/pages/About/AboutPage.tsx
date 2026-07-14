export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-8 py-12">
      <header className="mb-12">
        <h1 className="text-primary text-4xl font-bold">
          About Zoryn
        </h1>

        <p className="mt-4 max-w-4xl text-muted-foreground">
          Zoryn is an environmental reasoning engine that transforms
          environmental observations into transparent, scientifically
          traceable discoveries.
        </p>
      </header>

      <section className="space-y-6">
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Mission
          </h2>

          <p className="mt-3 text-muted-foreground">
            Build trusted environmental intelligence through deterministic,
            explainable scientific reasoning.
          </p>
        </article>

        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Core Philosophy
          </h2>

          <p className="mt-3 text-muted-foreground">
            Observation → Signature → Relationship → Evidence → Pattern →
            Hypothesis → Discovery.
          </p>
        </article>

        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Version
          </h2>

          <p className="mt-3 text-muted-foreground">
            Pilot 0.1.0
          </p>
        </article>
      </section>
    </main>
  );
}