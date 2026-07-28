import { formatConfidence } from "@/utils/reasoningFormat";

type DiscoveryCardProps = {
  discovery: string;
  confidence: number;
  summary: string;
  scientificBasis: string;
};

export default function DiscoveryCard({
  discovery,
  confidence,
  summary,
  scientificBasis,
}: DiscoveryCardProps) {
  return (
    <section className="rounded-2xl border border-[#D8CEB8] bg-[#FAF7EF] p-6 shadow-sm">

      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7C6A45]">
        Discovery
      </p>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">

        <div className="min-w-0 flex-1">

          <h2 className="text-2xl font-semibold leading-tight text-[#2B2417]">
            {discovery}
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#5A5240]">
            {summary}
          </p>

        </div>

        <span className="rounded-full border border-[#D8CEB8] bg-[#F3EEE2] px-3 py-1 text-sm font-medium text-[#2B2417]">

          {formatConfidence(confidence)}

        </span>

      </div>

      <div className="mt-6 flex flex-wrap gap-2">

        <span className="rounded-full bg-[#5B6B45] px-3 py-1 text-xs font-medium text-white">
          Active Discovery
        </span>

        <span className="rounded-full border border-[#D8CEB8] bg-[#F3EEE2] px-3 py-1 text-xs font-medium text-[#4A422F]">
          {scientificBasis}
        </span>

      </div>

    </section>
  );
}