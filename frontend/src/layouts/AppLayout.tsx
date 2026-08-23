import { Outlet } from "react-router-dom";

import NavigationBar from "@/components/layout/NavigationBar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F3EEE2] text-[#2B2417]">
      <NavigationBar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[#D8CEB8] bg-[#F3EEE2]">
        <div className="mx-auto flex max-w-287.5 items-center px-8 py-3">
          <p className="text-xs text-[#8A7B5C]">
            &copy; 2026 Zoryn
          </p>
        </div>
      </footer>
    </div>
  );
}