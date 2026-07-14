export default function StandardsPage() {
  const standards = [
    {
      name: "WMO SPI User Guide",
      status: "Implemented",
    },
    {
      name: "IPCC Risk Framework",
      status: "Planned",
    },
    {
      name: "FAO Drought Guidance",
      status: "Planned",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-8 py-12">
      <header className="mb-12">
        <h1 className="text-primary text-4xl font-bold">
          Scientific Standards
        </h1>

        <p className="mt-4 max-w-3xl text-muted-foreground">
          Zoryn bases its environmental reasoning on recognised scientific
          standards and documented methodologies.
        </p>
      </header>

      <section className="space-y-4">
        {standards.map((standard) => (
          <article
            key={standard.name}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold">
              {standard.name}
            </h2>

            <p className="mt-2 text-muted-foreground">
              {standard.status}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}