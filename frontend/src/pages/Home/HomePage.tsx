export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 32px",
        textAlign: "center",
        background: "#F8F6F2",
      }}
    >
      <img
        src="/src/assets/logos/zoryn.png"
        alt="Zoryn"
        style={{
          width: "160px",
          marginBottom: "32px",
        }}
      />

      <h1
        style={{
          fontSize: "3.5rem",
          margin: 0,
          color: "#6E5845",
          letterSpacing: "0.08em",
        }}
      >
        ZORYN
      </h1>

      <p
        style={{
          fontSize: "1.35rem",
          marginTop: "16px",
          color: "#4A433B",
          maxWidth: "720px",
        }}
      >
        Environmental Reasoning Engine
      </p>

      <p
        style={{
          marginTop: "12px",
          fontSize: "1.05rem",
          color: "#756B61",
        }}
      >
        Observe • Reason • Protect
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "48px",
        }}
      >
        <button>
          Launch Explorer
        </button>

        <button>
          Methodology
        </button>
      </div>

      <section
        style={{
          marginTop: "96px",
          maxWidth: "900px",
          lineHeight: 1.8,
        }}
      >
        <h2>
          Environmental reasoning that can be verified.
        </h2>

        <p>
          Zoryn transforms environmental observations into transparent,
          scientifically supported discoveries. Every conclusion can be traced
          through evidence, environmental patterns, hypotheses and recognised
          scientific standards.
        </p>
      </section>
    </main>
  );
}