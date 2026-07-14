const standards = [
  {
    name: "WMO SPI User Guide",
    description:
      "Meteorological drought classification using the Standardized Precipitation Index.",
    status: "Implemented",
  },
  {
    name: "IPCC Risk Framework",
    description:
      "Risk concepts for hazard, exposure and vulnerability.",
    status: "Planned",
  },
  {
    name: "FAO Drought Guidance",
    description:
      "Agricultural drought monitoring and interpretation.",
    status: "Planned",
  },
];

export default function StandardsPage() {
  return (
    <main className="mx-auto max-w-6xl px-8 py-12">
      <header className="mb-12">
        <h1 className="text-primary text-4xl font-bold">
          Scientific Standards
        </h1>

        <p className="mt-4 max-w-4xl text-muted-foreground">
          Every reasoning rule implemented in Zoryn is linked to a recognised
          scientific standard.
        </p>
      </header>

      <section className="space-y-6">
        {standards.map((standard) => (
          <article
            key={standard.name}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">
              {standard.name}
            </h2>

            <p className="mt-3 text-muted-foreground">
              {standard.description}
            </p>

            <span className="text-primary mt-4 inline-block text-sm font-semibold">
              {standard.status}
            </span>
          </article>
        ))}
      </section>
    </main>
  );
}