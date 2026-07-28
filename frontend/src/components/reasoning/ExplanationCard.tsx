import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type ScientificReference = {
  source: string;
  section: string;
  title: string;
  excerpt: string;
};

type ExplanationCardProps = {
  explanation: string;
  provider: string;
  model: string;
  latencyMs: number;
  totalTokens: number;
  reasoningVersion: string;
  generatedAt: string;
  references: ScientificReference[];
};

export default function ExplanationCard({
  explanation,
  provider,
  model,
  latencyMs,
  totalTokens,
  reasoningVersion,
  generatedAt,
  references,
}: ExplanationCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">

      <header className="border-b border-border px-6 py-5">
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
          AI Scientific Explanation
        </p>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This explanation is generated from Zoryn's deterministic
          environmental reasoning engine. The language model explains
          the scientific reasoning but never changes discoveries,
          evidence, confidence or conclusions.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">

          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium">
            {provider}
          </span>

          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium">
            {model}
          </span>

          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium">
            {Math.round(latencyMs)} ms
          </span>

          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium">
            {totalTokens.toLocaleString()} tokens
          </span>

        </div>
      </header>

      <article className="prose prose-slate dark:prose-invert max-w-none px-6 py-6">

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="mt-8 border-b border-border pb-3 text-2xl font-bold first:mt-0">
                {children}
              </h1>
            ),

            h2: ({ children }) => (
              <h2 className="mt-8 text-xl font-semibold">
                {children}
              </h2>
            ),

            h3: ({ children }) => (
              <h3 className="mt-6 text-lg font-semibold">
                {children}
              </h3>
            ),

            p: ({ children }) => (
              <p className="leading-8 text-foreground">
                {children}
              </p>
            ),

            ul: ({ children }) => (
              <ul className="list-disc space-y-2 pl-6">
                {children}
              </ul>
            ),

            ol: ({ children }) => (
              <ol className="list-decimal space-y-2 pl-6">
                {children}
              </ol>
            ),

            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                {children}
              </blockquote>
            ),

            code: ({ children }) => (
              <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
                {children}
              </code>
            ),
          }}
        >
          {explanation}
        </ReactMarkdown>

      </article>

      {references.length > 0 && (
        <section className="border-t border-border px-6 py-6">

          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Scientific References
          </h3>

          <div className="mt-5 space-y-4">

            {references.map((reference) => (
              <article
                key={`${reference.source}-${reference.title}`}
                className="rounded-lg border border-border bg-background p-5 transition-shadow hover:shadow-sm"
              >

                <div className="flex items-center justify-between">

                  <p className="font-semibold">
                    {reference.source}
                  </p>

                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                    {reference.section}
                  </span>

                </div>

                <h4 className="mt-3 font-medium">
                  {reference.title}
                </h4>

                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {reference.excerpt}
                </p>

              </article>
            ))}

          </div>

        </section>
      )}

      <footer className="border-t border-border bg-muted/30 px-6 py-5">

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">

          <div>
            <p className="font-medium text-muted-foreground">
              Reasoning Version
            </p>

            <p className="mt-1 font-semibold">
              {reasoningVersion}
            </p>
          </div>

          <div>
            <p className="font-medium text-muted-foreground">
              Generated
            </p>

            <p className="mt-1 font-semibold">
              {new Date(generatedAt).toLocaleString()}
            </p>
          </div>

        </div>

      </footer>

    </section>
  );
}