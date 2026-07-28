import { Outlet } from "react-router-dom";

import NavigationBar from "@/components/layout/NavigationBar";

const FONT_DISPLAY = "'Fraunces', serif";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F3EEE2] text-[#2B2417]">
      <NavigationBar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[#D8CEB8] bg-[#F3EEE2]">
        <div className="mx-auto flex max-w-287.5 items-center justify-between px-8 py-3">
          <p className="text-xs text-[#8A7B5C]">
            &copy; 2026 Zoryn
          </p>

          <p
            style={{ fontFamily: FONT_DISPLAY }}
            className="text-base font-black tracking-[0.2em] text-[#2B1B0E]"
          >
            ZORYN
          </p>

          <a
            href="https://www.linkedin.com/in/invincible-simon"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#8A7B5C] underline decoration-[#D8CEB8] underline-offset-4 transition-colors duration-200 hover:text-[#241F14]"
          >
            Built by Simon
          </a>
        </div>
      </footer>
    </div>
  );
}