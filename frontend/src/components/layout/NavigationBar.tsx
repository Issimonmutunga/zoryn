import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ArrowRight, LogOut, Menu, UserRound, X } from "lucide-react";

import { useAuthStore, useCurrentUser } from "@/stores/authStore";

// UI pass: matched to the rest of the site — moved off the cream/olive
// palette to the shared grayscale black/white scheme (#1A1A1A on
// #FAFAFA, borders #E5E5E5), and dropped the dedicated wordmark serif in
// favor of the same IBM Plex Sans used everywhere else, kept minimal:
// uppercase, tight, no color tint. The "Pilot · Nairobi" badge is
// removed and the tagline is replaced with "Evidence-Backed Discovery".
const FONT_BODY = "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif";

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
  const currentUser = useCurrentUser();
  const signOut = useAuthStore((state) => state.signOut);

  // Return to the current page after signing in (but not to the auth pages).
  const isAuthRoute = ["/login", "/signup"].includes(location.pathname);
  const signInState = isAuthRoute ? undefined : { from: location.pathname };

  // Presentation-only: close the mobile drawer on route change. Doesn't
  // touch routing or app state, just keeps the drawer from staying open
  // after a link is tapped.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      style={{ fontFamily: FONT_BODY }}
      className="sticky top-0 z-50 border-b border-[#E5E5E5] bg-[#FAFAFA]/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-19 max-w-287.5 items-center justify-between px-6 lg:px-8">
        {/* ------------------------------------------------------------ Logo */}
        <NavLink to="/" className="flex shrink-0 items-center gap-3">
          <div className="flex flex-col justify-center">
            <p
              className="text-xl font-semibold uppercase leading-none tracking-tight text-[#1A1A1A]"
            >
              Zoryn
            </p>
            <p className="mt-1 hidden text-xs font-normal leading-none text-[#6B6B6B] sm:block">
              Evidence-Backed Discovery
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
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/20",
                  isActive
                    ? "font-medium text-[#1A1A1A]"
                    : "text-[#6B6B6B] hover:bg-[#F2F2F2] hover:text-[#1A1A1A]",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={`pointer-events-none absolute inset-x-3.5 -bottom-px h-px bg-[#1A1A1A] transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ---------------------------------------------- Account + Explorer CTA */}
        <div className="hidden items-center lg:flex">
          {currentUser ? (
            <div className="flex items-center gap-1">
              <span
                className="flex max-w-44 items-center gap-2 px-2 text-sm text-[#1A1A1A]"
                title={currentUser.email}
              >
                <UserRound className="h-4 w-4 shrink-0 text-[#6B6B6B]" strokeWidth={1.75} />
                <span className="truncate">{currentUser.displayName}</span>
              </span>
              <button
                type="button"
                onClick={signOut}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-[#6B6B6B] transition-colors duration-200 hover:bg-[#F2F2F2] hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/20"
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                Sign out
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              state={signInState}
              className={({ isActive }) =>
                [
                  "rounded-md px-3.5 py-2 text-sm transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/20",
                  isActive
                    ? "font-medium text-[#1A1A1A]"
                    : "text-[#6B6B6B] hover:bg-[#F2F2F2] hover:text-[#1A1A1A]",
                ].join(" ")
              }
            >
              Sign in
            </NavLink>
          )}

          {primaryNav && (
            <NavLink
              to={primaryNav.path}
              className="group ml-4 flex items-center gap-2 rounded-lg bg-[#1A1A1A] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/20"
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
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[#E5E5E5] bg-white text-[#5A5A5A] transition-colors duration-200 hover:bg-[#F2F2F2] lg:hidden"
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
        className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-[#E5E5E5] bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
          <NavLink to="/" className="flex shrink-0 items-center gap-2">
            <p className="text-lg font-semibold uppercase leading-none tracking-tight text-[#1A1A1A]">
              Zoryn
            </p>
          </NavLink>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-[#E5E5E5] bg-white text-[#5A5A5A] transition-colors duration-200 hover:bg-[#F2F2F2]"
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
                    ? "bg-[#F2F2F2] font-medium text-[#1A1A1A]"
                    : "text-[#6B6B6B] hover:bg-[#F2F2F2] hover:text-[#1A1A1A]",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}

          {primaryNav && (
            <NavLink
              to={primaryNav.path}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#1A1A1A] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-black"
            >
              Open Explorer
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </NavLink>
          )}

          <div className="mt-4 border-t border-[#E5E5E5] pt-4">
            {currentUser ? (
              <>
                <div className="px-3 pb-2">
                  <p className="truncate text-sm font-medium text-[#1A1A1A]">
                    {currentUser.displayName}
                  </p>
                  <p className="truncate text-xs text-[#6B6B6B]">{currentUser.email}</p>
                </div>
                <button
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm text-[#6B6B6B] transition-colors duration-200 hover:bg-[#F2F2F2] hover:text-[#1A1A1A]"
                >
                  <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-1">
                <NavLink
                  to="/login"
                  state={signInState}
                  className="rounded-md px-3 py-2.5 text-sm text-[#6B6B6B] transition-colors duration-200 hover:bg-[#F2F2F2] hover:text-[#1A1A1A]"
                >
                  Sign in
                </NavLink>
                <NavLink
                  to="/signup"
                  state={signInState}
                  className="rounded-md px-3 py-2.5 text-sm text-[#6B6B6B] transition-colors duration-200 hover:bg-[#F2F2F2] hover:text-[#1A1A1A]"
                >
                  Create account
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}