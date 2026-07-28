import { formatTimestamp } from "@/utils/reasoningFormat";

type ScientificReference = {
  source: string;
  section: string;
  title: string;
  excerpt: string;
};

type Props = {
  references: ScientificReference[];
  reasoningVersion: string;
  generatedAt: string;
  provider: string;
  model: string;
};

export default function ReferencesMetadata({
  references,
  reasoningVersion,
  generatedAt,
  provider,
  model,
}: Props) {
  return (
    <div className="space-y-6">

      <div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7C6A45]">
          Scientific References
        </p>

        <ul className="mt-4 space-y-3">

          {references.map((reference) => (

            <li
              key={`${reference.source}-${reference.title}`}
              className="rounded-xl border border-[#D8CEB8] bg-[#F3EEE2] p-3"
            >

              <p className="text-sm font-medium text-[#2B2417]">
                {reference.source}
              </p>

              <p className="mt-1 text-sm text-[#5A5240]">
                {reference.title}
              </p>

              <p className="mt-1 text-xs text-[#7C6A45]">
                {reference.section}
              </p>

            </li>

          ))}

        </ul>

      </div>

      <div className="border-t border-[#D8CEB8] pt-6">

        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7C6A45]">
          Metadata
        </p>

        <dl className="mt-4 space-y-4">

          <div>

            <dt className="text-xs uppercase tracking-wide text-[#7C6A45]">
              Reasoning Version
            </dt>

            <dd className="mt-1 text-sm text-[#2B2417]">
              {reasoningVersion}
            </dd>

          </div>

          <div>

            <dt className="text-xs uppercase tracking-wide text-[#7C6A45]">
              Generated
            </dt>

            <dd className="mt-1 text-sm text-[#2B2417]">
              {formatTimestamp(generatedAt)}
            </dd>

          </div>

          <div>

            <dt className="text-xs uppercase tracking-wide text-[#7C6A45]">
              Provider
            </dt>

            <dd className="mt-1 text-sm text-[#2B2417]">
              {provider}
            </dd>

          </div>

          <div>

            <dt className="text-xs uppercase tracking-wide text-[#7C6A45]">
              Model
            </dt>

            <dd className="mt-1 text-sm text-[#2B2417]">
              {model}
            </dd>

          </div>

        </dl>

      </div>

    </div>
  );
}