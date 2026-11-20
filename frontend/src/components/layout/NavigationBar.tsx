import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";

import {
  EXPLORER,
  NAV_GROUPS,
  PRIMARY_ITEMS,
  isActivePath,
  type NavGroup,
} from "@/components/layout/navigation";
import { FONT_BODY } from "@/lib/fonts";

// Top bar. On desktop (lg and up) it carries the whole navigation: three
// inline links, two grouped menus, the account links and the Explorer call
// to action. Below lg it shrinks to a slim brand bar, and navigation moves to
// the bottom tab bar (MobileTabBar), as the UI specification asks.

const linkBase =
  "group relative rounded-md px-3 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/20";

function linkClass(active: boolean): string {
  return [
    linkBase,
    active
      ? "font-medium text-[#1A1A1A]"
      : "text-[#6B6B6B] hover:bg-[#F2F2F2] hover:text-[#1A1A1A]",
  ].join(" ");
}

function ActiveUnderline({ active }: { active: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute inset-x-3 -bottom-px h-px bg-[#1A1A1A] transition-opacity duration-200 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

/** A labelled menu of links that opens on click and closes on Escape, on a
 *  click outside, or when the route changes. */
function NavMenu({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  const active = group.items.some((item) => isActivePath(pathname, item.path));

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className={`${linkClass(active)} flex items-center gap-1`}
      >
        {group.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <ActiveUnderline active={active} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-[#E5E5E5] bg-white p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.10)]">
          {group.items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                    isActive ? "bg-[#F2F2F2]" : "hover:bg-[#F7F7F7]"
                  }`
                }
              >
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#6B6B6B]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span>
                  <span className="block text-sm font-medium text-[#1A1A1A]">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-[#6B6B6B]">
                    {item.description}
                  </span>
                </span>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function NavigationBar() {
  return (
    <header
      style={{ fontFamily: FONT_BODY }}
      className="sticky top-0 z-50 border-b border-[#E5E5E5] bg-[#FAFAFA]/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-287.5 items-center justify-between gap-4 px-5 sm:px-8 lg:h-19">
        {/* ------------------------------------------------------------ Logo */}
        <NavLink to="/" className="flex shrink-0 items-center gap-3">
          <div className="flex flex-col justify-center">
            <p className="text-lg font-semibold uppercase leading-none tracking-tight text-[#1A1A1A] lg:text-xl">
              Zoryn
            </p>
            <p className="mt-1 hidden text-xs font-normal leading-none text-[#6B6B6B] xl:block">
              Evidence-Backed Discovery
            </p>
          </div>
        </NavLink>

        {/* Phones and tablets: a quiet tagline; navigation is at the bottom. */}
        <p className="truncate text-xs text-[#6B6B6B] lg:hidden">
          Evidence-Backed Discovery
        </p>

        {/* -------------------------------------------------- Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {PRIMARY_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) => linkClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <ActiveUnderline active={isActive} />
                </>
              )}
            </NavLink>
          ))}

          {NAV_GROUPS.map((group) => (
            <NavMenu key={group.label} group={group} />
          ))}
        </nav>

        {/* ---------------------------------------------------- Explorer CTA */}
        <div className="hidden shrink-0 items-center lg:flex">
          <NavLink
            to="/login"
            className="rounded-md px-3 py-2 text-sm text-[#6B6B6B] transition-colors duration-200 hover:bg-[#F2F2F2] hover:text-[#1A1A1A]"
          >
            Log in
          </NavLink>
          <NavLink
            to="/signup"
            className="rounded-md px-3 py-2 text-sm font-medium text-[#1A1A1A] transition-colors duration-200 hover:bg-[#F2F2F2]"
          >
            Sign up
          </NavLink>
          <NavLink
            to={EXPLORER.path}
            className="group ml-3 flex items-center gap-2 rounded-lg bg-[#1A1A1A] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/20"
          >
            Open Explorer
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </NavLink>
        </div>
      </div>
    </header>
  );
}
