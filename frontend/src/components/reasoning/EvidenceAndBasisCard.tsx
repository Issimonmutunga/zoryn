import {
  directionArrow,
  formatPatternLabel,
  groupEvidence,
  toTitleCase,
} from "@/utils/reasoningFormat";

type EvidenceItem = {
  variable: string;
  direction: string;
  strength: number;
};

type Props = {
  evidence: EvidenceItem[];
  standard: string;
  rule: string;
  reason: string;
};

export default function EvidenceAndBasisCard({
  evidence,
  standard,
  rule,
  reason,
}: Props) {

  const groups =
    groupEvidence(
      evidence,
    );

  return (

    <div className="space-y-6">

      <div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7C6A45]">

          Evidence

        </p>

        <div className="mt-4 flex flex-wrap gap-2">

          {groups.map(
            (item) => (

              <span
                key={`${item.variable}-${item.direction}`}
                className="inline-flex items-center rounded-full border border-[#D8CEB8] bg-[#F3EEE2] px-3 py-1 text-sm text-[#2B2417]"
              >

                {toTitleCase(
                  item.variable,
                )}

                {" "}

                {directionArrow(
                  item.direction,
                )}

                {" ×"}

                {item.count}

              </span>

            ),
          )}

        </div>

      </div>

      <div className="border-t border-[#D8CEB8] pt-6">

        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7C6A45]">

          Scientific Basis

        </p>

        <dl className="mt-4 space-y-4">

          <div>

            <dt className="text-xs uppercase tracking-wide text-[#7C6A45]">

              Standard

            </dt>

            <dd className="mt-1 text-base font-medium text-[#2B2417]">

              {standard}

            </dd>

          </div>

          <div>

            <dt className="text-xs uppercase tracking-wide text-[#7C6A45]">

              Applied Rule

            </dt>

            <dd className="mt-1 text-base font-medium text-[#2B2417]">

              {formatPatternLabel(
                rule,
              )}

            </dd>

          </div>

          <div>

            <dt className="text-xs uppercase tracking-wide text-[#7C6A45]">

              Interpretation

            </dt>

            <dd className="mt-2 text-sm leading-7 text-[#5A5240]">

              {reason}

            </dd>

          </div>

        </dl>

      </div>

    </div>

  );

}