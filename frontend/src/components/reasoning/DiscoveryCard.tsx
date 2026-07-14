type DiscoveryCardProps = {
  discovery: string;
  confidence: number;
  summary: string;
  scientificBasis: string;
};

export default function DiscoveryCard({
  discovery,
  confidence,
  summary,
  scientificBasis,
}: DiscoveryCardProps) {
  const percentage = Math.round(
    confidence * 100,
  );

  return (
    <section
      style={{
        background: "#FFFFFF",
        border: "1px solid #DDD6C8",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <header>
        <p
          style={{
            margin: 0,
            color: "#6E5845",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          Discovery
        </p>

        <h2
          style={{
            marginTop: "8px",
            marginBottom: 0,
            fontSize: "1.7rem",
            color: "#2F2A24",
          }}
        >
          {discovery}
        </h2>
      </header>

      <section>
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            color: "#6E5845",
          }}
        >
          Reasoning Confidence
        </p>

        <div
          style={{
            marginTop: "12px",
            height: "10px",
            background: "#E8E2D7",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              background: "#6E5845",
            }}
          />
        </div>

        <p
          style={{
            marginTop: "8px",
            marginBottom: 0,
            color: "#5F5A54",
          }}
        >
          {percentage}% confidence
        </p>
      </section>

      <section>
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            color: "#6E5845",
          }}
        >
          Summary
        </p>

        <p
          style={{
            marginTop: "10px",
            lineHeight: 1.7,
          }}
        >
          {summary}
        </p>
      </section>

      <section>
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            color: "#6E5845",
          }}
        >
          Scientific Basis
        </p>

        <p
          style={{
            marginTop: "10px",
            marginBottom: 0,
          }}
        >
          {scientificBasis}
        </p>
      </section>
    </section>
  );
}