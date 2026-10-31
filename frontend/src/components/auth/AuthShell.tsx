import type { ReactNode } from "react";

// Shared frame for the sign-in and sign-up screens. Follows the site's
// grayscale scheme (#1A1A1A on #FAFAFA, borders #E5E5E5) and IBM Plex Sans.
const FONT_BODY = "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div
      style={{ fontFamily: FONT_BODY }}
      className="flex min-h-[calc(100vh-7rem)] items-center justify-center bg-[#FAFAFA] px-4 py-12 antialiased text-[#3A3A3A]"
    >
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#E5E5E5] bg-white px-6 py-8 shadow-sm sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B6B6B]">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-semibold uppercase text-[#1A1A1A]">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#6B6B6B]">
            {description}
          </p>

          <div className="mt-8">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-[#6B6B6B]">{footer}</p>
      </div>
    </div>
  );
}
