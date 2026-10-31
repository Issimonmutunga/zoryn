import type { ReactNode } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

interface AuthSubmitProps {
  pending: boolean;
  pendingLabel: string;
  children: ReactNode;
}

export default function AuthSubmit({
  pending,
  pendingLabel,
  children,
}: AuthSubmitProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1A1A1A] px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/20 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
          {pendingLabel}
        </>
      ) : (
        <>
          {children}
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            strokeWidth={1.75}
          />
        </>
      )}
    </button>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="rounded-lg border border-[#F1C9C4] bg-[#FDF3F2] px-3.5 py-2.5 text-sm leading-relaxed text-[#9B2C20]"
    >
      {message}
    </div>
  );
}
