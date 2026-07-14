import { Outlet } from "react-router-dom";

import NavigationBar from "@/components/layout/NavigationBar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NavigationBar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-8 text-sm text-muted-foreground">
          <span>Zoryn Environmental Reasoning Engine</span>

          <span>v0.1.0</span>
        </div>
      </footer>
    </div>
  );
}