import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#F8F6F2",
        color: "#2F2A24",
      }}
    >
      <header
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          borderBottom: "1px solid #DDD6C8",
          background: "#F8F6F2",
        }}
      >
        <div
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          ZORYN
        </div>

        <nav
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "center",
          }}
        >
          <span>Home</span>
          <span>Explorer</span>
          <span>Methodology</span>
          <span>Standards</span>
          <span>About</span>
        </nav>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </main>

      <footer
        style={{
          borderTop: "1px solid #DDD6C8",
          padding: "16px 32px",
          fontSize: "0.875rem",
          color: "#6E5845",
        }}
      >
        Zoryn • Environmental Reasoning Engine
      </footer>
    </div>
  );
}