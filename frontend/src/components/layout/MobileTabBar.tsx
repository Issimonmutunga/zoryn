import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Ellipsis, X } from "lucide-react";

import {
  NAV_GROUPS,
  TAB_ITEMS,
  isActivePath,
} from "@/components/layout/navigation";
import { FONT_BODY, FONT_MONO } from "@/lib/fonts";

// Bottom navigation for phones and tablets (below lg). Four destinations sit
// within thumb reach; everything else is one tap away in the "More" sheet.
// The bar pads itself for the home-indicator area on notched phones, and its
// height is published as --tabbar-h (index.css) so pages can leave room.

const tabClass = (active: boolean) =>
  `relative flex h-14 w-full flex-col items-center justify-center gap-1 text-[11px] leading-none transition-colors ${
    active ? "font-medium text-[#1A1A1A]" : "text-[#6B6B6B]"
  }`;

function ActiveMark({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute top-0 h-0.5 w-8 rounded-b-full bg-[#1A1A1A] transition-opacity ${
        active ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

export default function MobileTabBar() {
  const { pathname } = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const moreActive =
    NAV_GROUPS.some((group) =>
      group.items.some((item) => isActivePath(pathname, item.path)),
    ) || moreOpen;

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // While the sheet is open, keep the page behind it from scrolling and let
  // Escape close it.
  useEffect(() => {
    if (!moreOpen) {
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMoreOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [moreOpen]);

  return (
    <div style={{ fontFamily: FONT_BODY }} className="lg:hidden">
      {moreOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setMoreOpen(false)}
            aria-hidden="true"
          />

          <div
            id="more-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="More destinations"
            className="sheet-in fixed inset-x-0 bottom-[var(--tabbar-h)] z-40 max-h-[calc(100dvh-var(--tabbar-h)-4rem)] overflow-y-auto overscroll-contain rounded-t-2xl border-t border-[#E5E5E5] bg-white shadow-[0_-12px_32px_rgba(0,0,0,0.12)]"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-[#F0F0F0] bg-white px-5 py-3">
              <p className="text-sm font-semibold text-[#1A1A1A]">More</p>

              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Close"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-[#5A5A5A] hover:bg-[#F2F2F2]"
              >
                <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>

            <div className="mx-auto max-w-xl space-y-5 px-5 py-4">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p
                    style={{ fontFamily: FONT_MONO }}
                    className="text-[10px] uppercase tracking-[0.16em] text-[#6B6B6B]"
                  >
                    {group.label}
                  </p>

                  <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {group.items.map((item) => {
                      const Icon = item.icon;

                      return (
                        <li key={item.path}>
                          <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                              `flex min-h-12 items-center gap-3 rounded-lg px-3 py-2 ${
                                isActive ? "bg-[#F2F2F2]" : "hover:bg-[#F7F7F7]"
                              }`
                            }
                          >
                            <Icon
                              className="h-4.5 w-4.5 shrink-0 text-[#5A5A5A]"
                              strokeWidth={1.75}
                              aria-hidden="true"
                            />
                            <span className="min-w-0">
                              <span className="block text-[15px] font-medium text-[#1A1A1A]">
                                {item.label}
                              </span>
                              <span className="block truncate text-xs text-[#6B6B6B]">
                                {item.description}
                              </span>
                            </span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-2 border-t border-[#E5E5E5] pt-4">
                <NavLink
                  to="/login"
                  className="flex min-h-11 items-center justify-center rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#1A1A1A] hover:bg-[#F2F2F2]"
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className="flex min-h-11 items-center justify-center rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#1A1A1A] hover:bg-[#F2F2F2]"
                >
                  Sign up
                </NavLink>
              </div>
            </div>
          </div>
        </>
      )}

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E5E5E5] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
      >
        <ul className="mx-auto grid max-w-xl grid-cols-5">
          {TAB_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = !moreOpen && isActivePath(pathname, item.path);

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  aria-current={active ? "page" : undefined}
                  className={tabClass(active)}
                >
                  <ActiveMark active={active} />
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}

          <li>
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-controls="more-sheet"
              onClick={() => setMoreOpen((open) => !open)}
              className={tabClass(moreActive)}
            >
              <ActiveMark active={moreActive} />
              <Ellipsis className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              More
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
