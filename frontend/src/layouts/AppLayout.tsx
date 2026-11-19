import { Outlet, useLocation } from "react-router-dom";

import NavigationBar from "@/components/layout/NavigationBar";

export default function AppLayout() {
  // The explorer is a full-height map; a footer below it would make the page
  // scroll past the viewport (notably on phones).
  const isExplorer = useLocation().pathname.startsWith("/explorer");

  return (
    <div className="flex min-h-dvh flex-col bg-[#F3EEE2] text-[#2B2417]">
      <NavigationBar />

      <main className="flex-1">
        <Outlet />
      </main>

      {!isExplorer && (
      <footer className="border-t border-[#D8CEB8] bg-[#F3EEE2]">
        <div className="mx-auto flex max-w-287.5 items-center px-5 py-3 sm:px-8">
          <p className="text-xs text-[#8A7B5C]">
            &copy; 2026 Zoryn
          </p>
        </div>
      </footer>
      )}
    </div>
  );
}