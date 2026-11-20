import type { ReactNode } from "react";
import { CircleSlash, RotateCw, TriangleAlert, WifiOff } from "lucide-react";

import { describeError } from "@/utils/apiError";

// Loading, empty and error states, shared so they look the same on every
// screen (UI specification 2.10 - 2.13): skeletons instead of spinners, empty
// states that explain the absence, and errors that say what failed, why, and
// how to recover.

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-[#EDEDED] ${className}`}
    />
  );
}

export function SkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Loading" className="space-y-3">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-16 w-full" />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D4D4D4] bg-white px-5 py-10 text-center sm:px-8">
      <CircleSlash
        className="mx-auto h-5 w-5 text-[#8A8A8A]"
        strokeWidth={1.75}
        aria-hidden="true"
      />

      <h3 className="mt-4 text-base font-semibold text-[#1A1A1A]">{title}</h3>

      {children && (
        <div className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B6B6B]">
          {children}
        </div>
      )}

      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function ErrorState({
  error,
  subject,
  onRetry,
}: {
  error: unknown;
  /** What was being loaded, e.g. "The discovery list". */
  subject: string;
  onRetry?: () => void;
}) {
  const description = describeError(error, subject);
  const Icon = description.offline ? WifiOff : TriangleAlert;

  return (
    <div
      role="alert"
      className="rounded-2xl border border-[#E5E5E5] bg-white px-5 py-8 sm:px-8"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#F2F2F2]">
          <Icon
            className="h-4 w-4 text-[#3A3A3A]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[#1A1A1A]">
            {description.title}
          </h3>

          <p className="mt-1 text-sm leading-6 text-[#5A5A5A]">
            {description.cause} {description.recovery}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-4 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#F2F2F2]"
            >
              <RotateCw className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
