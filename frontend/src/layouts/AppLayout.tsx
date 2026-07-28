import { Outlet } from "react-router-dom";

import NavigationBar from "@/components/layout/NavigationBar";

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_MONO = "'IBM Plex Mono', ui-monospace, monospace";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F3EEE2] text-[#2B2417]">
      <NavigationBar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[#D8CEB8] bg-[#F3EEE2]">
        <div className="mx-auto max-w-287.5 px-8 py-16">
          <div className="flex flex-col gap-10 text-center md:flex-row md:items-start md:justify-between md:gap-8 md:text-left">
            {/* --------------------------------------------------- Left */}
            <div>
              <p
                style={{ fontFamily: FONT_DISPLAY }}
                className="text-xl font-black tracking-widest text-[#2B1B0E]"
              >
                ZORYN
              </p>
              <p className="mt-1 text-xs text-[#8A7B5C]">
                Environmental Intelligence Platform
              </p>
              <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-[#5A5240] md:mx-0">
                Turning environmental observations into trusted decisions.
              </p>
            </div>

            {/* -------------------------------------------------- Right */}
            <div>
              <p
                style={{ fontFamily: FONT_MONO }}
                className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7C6A45]"
              >
                Pilot
              </p>
              <p className="mt-1.5 text-sm text-[#4A422F]">
                Meteorological Drought
              </p>

              <p
                style={{ fontFamily: FONT_MONO }}
                className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#7C6A45]"
              >
                Built by
              </p>
              <a
                href="https://www.linkedin.com/in/invincible-simon"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-block text-sm text-[#4A422F] underline decoration-[#D8CEB8] underline-offset-4 transition-colors duration-200 hover:text-[#241F14] hover:decoration-[#7C6A45]"
              >
                Simon
              </a>
            </div>
          </div>

          <div className="mt-14 border-t border-[#D8CEB8] pt-6 text-center">
            <p className="text-xs text-[#8A7B5C]">
              &copy; 2026 Zoryn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}