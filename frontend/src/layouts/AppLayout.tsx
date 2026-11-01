import { Outlet, useLocation } from "react-router-dom";

import NavigationBar from "@/components/layout/NavigationBar";
import { useSessionCheck } from "@/hooks/useAuth";

export default function AppLayout() {
  useSessionCheck();

  // The explorer is a full-height workspace: it takes exactly the space
  // under the navigation bar, with no footer pushing the reasoning drawer
  // off the bottom of the screen.
  const { pathname } = useLocation();
  const isWorkspace = pathname === "/explorer";

  return (
    <div
      className={`flex flex-col bg-[#F3EEE2] text-[#2B2417] ${
        isWorkspace ? "h-dvh overflow-hidden" : "min-h-dvh"
      }`}
    >
      <NavigationBar />

      <main className="min-h-0 flex-1">
        <Outlet />
      </main>

      {!isWorkspace && (
        <footer className="border-t border-[#D8CEB8] bg-[#F3EEE2]">
          <div className="mx-auto flex max-w-287.5 items-center px-4 py-3 sm:px-6 lg:px-8">
            <p className="text-xs text-[#8A7B5C]">
              &copy; 2026 Zoryn
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
