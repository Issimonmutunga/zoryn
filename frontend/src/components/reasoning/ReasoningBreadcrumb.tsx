type ReasoningBreadcrumbProps = {
  current: string;
};

const stages = [
  "Observation",
  "Signature",
  "Relationship",
  "Evidence",
  "Pattern",
  "Hypothesis",
  "Discovery",
];

export default function ReasoningBreadcrumb({
  current,
}: ReasoningBreadcrumbProps) {
  return (
    <nav className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {stages.map((stage, index) => (
          <li
            key={stage}
            className="flex items-center gap-2"
          >
            <span
              className={
                stage === current
                  ? "font-semibold text-primary"
                  : "text-muted-foreground"
              }
            >
              {stage}
            </span>

            {index < stages.length - 1 && (
              <span className="text-muted-foreground">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}