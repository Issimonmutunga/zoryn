import { Link, Outlet } from "react-router-dom";

// Minimal, mobile-first shell for login / signup: no site nav, centred card,
// safe-area padding for notched phones, dvh so the on-screen keyboard and
// browser chrome don't cause a jumpy 100vh.
export default function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#FAFAFA] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] text-[#3A3A3A] sm:items-center sm:justify-center sm:py-10">
      <Link
        to="/"
        className="mb-8 self-start text-xl font-semibold uppercase leading-none tracking-tight text-[#1A1A1A] sm:mb-6 sm:self-center"
      >
        Zoryn
      </Link>

      <main className="w-full sm:max-w-md">
        <Outlet />
      </main>

      <p className="mt-8 text-xs text-[#8A8A8A] sm:text-center">
        &copy; 2026 Zoryn
      </p>
    </div>
  );
}
