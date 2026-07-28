const CHAIN = [
  "Observation",
  "Signature",
  "Relationship",
  "Evidence",
  "Pattern",
  "Hypothesis",
  "Discovery",
];

export default function ReasoningChain() {
  return (
    <ol className="relative ml-2 border-l border-[#D8CEB8] pl-6">
      {CHAIN.map((step, index) => (
        <li
          key={step}
          className={index === CHAIN.length - 1 ? "" : "pb-6"}
        >
          <span
            aria-hidden="true"
            className="absolute -left-1.75 mt-1.5 h-3 w-3 rounded-full border-2 border-[#5B6B45] bg-[#FAF7EF]"
          />

          <p className="text-sm font-medium text-[#2B2417]">
            {step}
          </p>
        </li>
      ))}
    </ol>
  );
}