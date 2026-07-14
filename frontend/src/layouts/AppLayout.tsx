import { Outlet } from "react-router-dom";

import NavigationBar from "../components/layout/NavigationBar";

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
      <NavigationBar />

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.9rem",
          color: "#6E5845",
        }}
      >
        <span>
          Zoryn Environmental Reasoning Engine
        </span>

        <span>
          Version 0.1.0
        </span>
      </footer>
    </div>
  );
}