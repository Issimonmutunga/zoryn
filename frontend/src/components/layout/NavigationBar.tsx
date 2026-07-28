import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";

import logo from "@/assets/logos/zoryn.png";

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_MONO = "'IBM Plex Mono', ui-monospace, monospace";

const navigation = [
  { label: "Home", path: "/" },
  { label: "Explorer", path: "/explorer", primary: true },
  { label: "Methodology", path: "/methodology" },
  { label: "Standards", path: "/standards" },
  { label: "About", path: "/about" },
];

// Secondary links render in the horizontal nav; the primary (Explorer) is
// pulled out into its own CTA further along the bar.
const secondaryNav = navigation.filter((item) => !item.primary);
const primaryNav = navigation.find((item) => item.primary);

export default function NavigationBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Presentation-only: close the mobile drawer on route change. Doesn't
  // touch routing or app state, just keeps the drawer from staying open
  // after a link is tapped.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#D8CEB8] bg-[#F3EEE2]/90 backdrop-blur-md">
      <div className="mx-auto flex h-19 max-w-287.5 items-center justify-between px-6 lg:px-8">
        {/* ------------------------------------------------------------ Logo */}
        <NavLink to="/" className="flex shrink-0 items-center gap-3">
          <img src={logo} alt="Zoryn" className="h-11 w-11 shrink-0" />

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2.5">
              <p
                style={{ fontFamily: FONT_DISPLAY }}
                className="text-[1.85rem] font-black leading-none tracking-widest text-[#2B1B0E]"
              >
                ZORYN
              </p>
              <span
                style={{ fontFamily: FONT_MONO }}
                className="rounded-full border border-[#D8CEB8] bg-[#EDE6D3] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-[#7C6A45]"
              >
                Pilot &middot; Nairobi
              </span>
            </div>
            <p className="mt-1 hidden text-xs font-normal leading-none text-[#8A7B5C] sm:block">
              Environmental Intelligence Platform
            </p>
          </div>
        </NavLink>

        {/* -------------------------------------------------- Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {secondaryNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "group relative rounded-md px-3.5 py-2 text-sm transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6B45]/40",
                  isActive
                    ? "font-medium text-[#241F14]"
                    : "text-[#5A5240] hover:bg-[#EDE6D3] hover:text-[#241F14]",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={`pointer-events-none absolute inset-x-3.5 -bottom-px h-px bg-[#7C6A45] transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ---------------------------------------------------- Explorer CTA */}
        <div className="hidden items-center lg:flex">
          {primaryNav && (
            <NavLink
              to={primaryNav.path}
              className="group ml-4 flex items-center gap-2 rounded-lg bg-[#39492F] px-4 py-2.5 text-sm font-medium text-[#F3EEE2] transition-colors duration-200 hover:bg-[#2E3B25] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6B45]/40"
            >
              Open Explorer
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </NavLink>
          )}
        </div>

        {/* ------------------------------------------------- Mobile trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[#D8CEB8] bg-[#FAF7EF] text-[#4A422F] transition-colors duration-200 hover:bg-[#EDE6D3] lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-4.5 w-4.5" strokeWidth={1.75} />
          ) : (
            <Menu className="h-4.5 w-4.5" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* ------------------------------------------------------- Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-[#D8CEB8] bg-[#FAF7EF] shadow-xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#D8CEB8] px-6 py-4">
          <NavLink to="/" className="flex shrink-0 items-center gap-2">
            <img src={logo} alt="Zoryn" className="h-9 w-9 shrink-0" />
            <p
              style={{ fontFamily: FONT_DISPLAY }}
              className="text-xl font-black leading-none tracking-widest text-[#2B1B0E]"
            >
              ZORYN
            </p>
          </NavLink>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-[#D8CEB8] bg-[#FAF7EF] text-[#4A422F] transition-colors duration-200 hover:bg-[#EDE6D3]"
            aria-label="Close menu"
          >
            <X className="h-4.5 w-4.5" strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-6 py-4" aria-label="Mobile">
          {secondaryNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "rounded-md px-3 py-2.5 text-sm transition-colors duration-200",
                  isActive
                    ? "bg-[#EDE6D3] font-medium text-[#241F14]"
                    : "text-[#5A5240] hover:bg-[#EDE6D3] hover:text-[#241F14]",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}

          {primaryNav && (
            <NavLink
              to={primaryNav.path}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#39492F] px-4 py-2.5 text-sm font-medium text-[#F3EEE2] transition-colors duration-200 hover:bg-[#2E3B25]"
            >
              Open Explorer
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}