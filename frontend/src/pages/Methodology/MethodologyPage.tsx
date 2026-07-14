export default function MethodologyPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-8 py-12">
      <header className="mb-12">
        <h1 className="text-primary text-4xl font-bold">
          Methodology
        </h1>

        <p className="mt-4 max-w-3xl text-muted-foreground">
          Every environmental discovery produced by Zoryn is derived through a
          transparent reasoning process grounded in scientific standards.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-7">
        {[
          "Observation",
          "Signature",
          "Relationship",
          "Evidence",
          "Pattern",
          "Hypothesis",
          "Discovery",
        ].map((step) => (
          <article
            key={step}
            className="rounded-xl border border-border bg-card p-4 text-center shadow-sm"
          >
            <h2 className="font-semibold">
              {step}
            </h2>
          </article>
        ))}
      </section>
    </main>
  );
}