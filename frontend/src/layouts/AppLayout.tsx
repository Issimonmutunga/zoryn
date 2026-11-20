import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import MobileTabBar from "@/components/layout/MobileTabBar";
import NavigationBar from "@/components/layout/NavigationBar";

export default function AppLayout() {
  const { pathname } = useLocation();

  // The explorer is a full-height map; a footer below it would make the page
  // scroll past the viewport (notably on phones).
  const isExplorer = pathname.startsWith("/explorer");

  // A new screen starts at its top. Without this a long page keeps the
  // previous page's scroll offset, which on a phone lands mid-content.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAFAFA] text-[#3A3A3A]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-[#1A1A1A] focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <NavigationBar />

      <div id="main" className="flex-1">
        <Outlet />
      </div>

      {/* The footer's bottom padding keeps it clear of the phone tab bar
          (--tabbar-h is 0 on desktop). */}
      {!isExplorer && (
        <footer className="border-t border-[#E5E5E5] bg-[#FAFAFA] pb-[var(--tabbar-h)]">
          <div className="mx-auto flex max-w-287.5 items-center justify-between px-5 py-4 sm:px-8">
            <p className="text-xs text-[#6B6B6B]">&copy; 2026 Zoryn</p>

            <Link
              to="/status"
              className="text-xs text-[#6B6B6B] underline decoration-[#CFCFCF] underline-offset-4 hover:text-[#1A1A1A]"
            >
              System status
            </Link>
          </div>
        </footer>
      )}

      <MobileTabBar />
    </div>
  );
}
