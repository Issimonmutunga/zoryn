import { useMemo } from "react";
import { CircleCheck, CircleX, LoaderCircle, RotateCw } from "lucide-react";

import {
  Card,
  Container,
  MonoLabel,
  PageHeader,
  PageShell,
} from "@/components/page/PageShell";
import { useApiVersion, useDiscoveryTimeline } from "@/hooks/useDiscoveries";
import { useHealth } from "@/hooks/useKnowledge";
import { FONT_MONO } from "@/lib/fonts";
import { API_BASE_URL } from "@/services/api/client";
import { describeError } from "@/utils/apiError";
import { formatMonthShort } from "@/utils/months";

// "Is the system working?" - live checks against the API. Each check states
// its result in words with an icon; colour is never the only signal. A failed
// check says what failed, the likely cause and what to do.

type CheckState = "ok" | "fail" | "checking";

interface Check {
  name: string;
  state: CheckState;
  summary: string;
  detail?: string;
}

// Reserved status colours, used for the icon only and always with a label.
const GOOD = "#0A8A0A";
const CRITICAL = "#D03B3B";

function apiHost(): string {
  try {
    return new URL(API_BASE_URL).host;
  } catch {
    return API_BASE_URL;
  }
}

function StateIcon({ state }: { state: CheckState }) {
  if (state === "ok") {
    return <CircleCheck className="h-5 w-5" strokeWidth={1.75} style={{ color: GOOD }} aria-hidden="true" />;
  }

  if (state === "fail") {
    return <CircleX className="h-5 w-5" strokeWidth={1.75} style={{ color: CRITICAL }} aria-hidden="true" />;
  }

  return (
    <LoaderCircle
      className="h-5 w-5 animate-spin text-[#8A8A8A]"
      strokeWidth={1.75}
      aria-hidden="true"
    />
  );
}

const STATE_LABEL: Record<CheckState, string> = {
  ok: "Working",
  fail: "Failed",
  checking: "Checking",
};

export default function StatusPage() {
  const health = useHealth();
  const version = useApiVersion();
  const timeline = useDiscoveryTimeline();

  const checks = useMemo<Check[]>(() => {
    const list: Check[] = [];

    if (health.isFetching && !health.data) {
      list.push({ name: "Zoryn API", state: "checking", summary: "Contacting the API…" });
    } else if (health.isError) {
      const error = describeError(health.error, "The API status");

      list.push({
        name: "Zoryn API",
        state: "fail",
        summary: "Not responding",
        detail: `${error.cause} ${error.recovery}`,
      });
    } else {
      list.push({
        name: "Zoryn API",
        state: "ok",
        summary: `Responding in ${health.data?.latencyMs ?? 0} ms`,
      });
    }

    if (health.isFetching && !health.data) {
      list.push({ name: "Knowledge dataset", state: "checking", summary: "Waiting for the API…" });
    } else if (health.isError) {
      list.push({
        name: "Knowledge dataset",
        state: "fail",
        summary: "Unknown",
        detail: "It cannot be checked until the API responds.",
      });
    } else if ((health.data?.discoveries ?? 0) === 0) {
      list.push({
        name: "Knowledge dataset",
        state: "fail",
        summary: "Loaded, but empty",
        detail: "The API is running without any discoveries. Verify that the exported knowledge dataset exists on the server.",
      });
    } else {
      list.push({
        name: "Knowledge dataset",
        state: "ok",
        summary: `${(health.data?.discoveries ?? 0).toLocaleString()} discoveries loaded`,
      });
    }

    if (timeline.isLoading) {
      list.push({ name: "Discovery timeline", state: "checking", summary: "Loading…" });
    } else if (timeline.isError) {
      const error = describeError(timeline.error, "The discovery timeline");

      list.push({
        name: "Discovery timeline",
        state: "fail",
        summary: "Could not be loaded",
        detail: `${error.cause} ${error.recovery}`,
      });
    } else {
      const months = [...(timeline.data ?? [])].sort((a, b) =>
        a.timestamp.localeCompare(b.timestamp),
      );

      list.push({
        name: "Discovery timeline",
        state: months.length > 0 ? "ok" : "fail",
        summary:
          months.length > 0
            ? `${months.length} months, ${formatMonthShort(months[0].timestamp)} – ${formatMonthShort(months[months.length - 1].timestamp)}`
            : "No months with discoveries",
      });
    }

    if (version.isLoading) {
      list.push({ name: "API version", state: "checking", summary: "Loading…" });
    } else if (version.isError || !version.data) {
      list.push({
        name: "API version",
        state: "fail",
        summary: "Could not be read",
        detail: "The API did not report its version.",
      });
    } else {
      list.push({
        name: "API version",
        state: "ok",
        summary: `${version.data.name} ${version.data.version} (${version.data.api})`,
      });
    }

    return list;
  }, [health, timeline, version]);

  const failures = checks.filter((check) => check.state === "fail").length;
  const checking = checks.some((check) => check.state === "checking");
  const overall: CheckState = checking ? "checking" : failures > 0 ? "fail" : "ok";

  const headline =
    overall === "checking"
      ? "Checking the system…"
      : overall === "ok"
        ? "Everything is working."
        : `${failures} of ${checks.length} checks failed.`;

  function recheck() {
    void health.refetch();
    void version.refetch();
    void timeline.refetch();
  }

  const checkedAt = health.data?.checkedAt
    ? new Intl.DateTimeFormat("en", { timeStyle: "medium" }).format(
        new Date(health.data.checkedAt),
      )
    : null;

  return (
    <PageShell>
      <PageHeader
        question="Is the system working?"
        title="Status"
        lede="Live checks of the service behind this application."
      />

      <Container className="space-y-6 py-8 sm:py-12">
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3" role="status" aria-live="polite">
              <StateIcon state={overall} />
              <p className="text-lg font-semibold text-[#1A1A1A]">{headline}</p>
            </div>

            <button
              type="button"
              onClick={recheck}
              disabled={checking}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-4 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#F2F2F2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCw className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Check again
            </button>
          </div>

          <p
            style={{ fontFamily: FONT_MONO }}
            className="mt-3 break-all text-[11px] text-[#6B6B6B]"
          >
            API {apiHost()}
            {checkedAt ? ` · checked ${checkedAt}` : ""}
          </p>
        </Card>

        <ul className="space-y-2">
          {checks.map((check) => (
            <li
              key={check.name}
              className="flex items-start gap-4 rounded-xl border border-[#E5E5E5] bg-white p-4 sm:p-5"
            >
              <span className="mt-0.5 shrink-0">
                <StateIcon state={check.state} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="text-[15px] font-semibold text-[#1A1A1A]">
                    {check.name}
                  </p>
                  <MonoLabel>{STATE_LABEL[check.state]}</MonoLabel>
                </div>

                <p className="mt-1 text-sm leading-6 text-[#3A3A3A]">
                  {check.summary}
                </p>

                {check.detail && (
                  <p className="mt-1 text-sm leading-6 text-[#6B6B6B]">
                    {check.detail}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </PageShell>
  );
}
