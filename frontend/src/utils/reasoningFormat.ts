export type EvidenceGroup = {
  variable: string;
  direction: string;
  count: number;
};

export type ExplanationSection = {
  title: string;
  content: string;
};

export function groupEvidence(
  evidence: {
    variable: string;
    direction: string;
  }[],
): EvidenceGroup[] {

  const groups = new Map<
    string,
    EvidenceGroup
  >();

  for (const item of evidence) {

    const key =
      `${item.variable}:${item.direction}`;

    const existing =
      groups.get(key);

    if (existing) {

      existing.count++;

      continue;

    }

    groups.set(
      key,
      {
        variable:
          item.variable,
        direction:
          item.direction,
        count: 1,
      },
    );

  }

  return [
    ...groups.values(),
  ];

}

export function directionArrow(
  direction: string,
): string {

  switch (
    direction.toLowerCase()
  ) {

    case "increase":
      return "↑";

    case "decrease":
      return "↓";

    default:
      return "•";

  }

}

export function toTitleCase(
  value: string,
): string {

  return value
    .replaceAll(
      "_",
      " ",
    )
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase(),
    );

}

export function formatPatternLabel(
  value: string,
): string {

  return toTitleCase(
    value,
  );

}

export function formatTimestamp(
  value?: string,
): string {

  if (!value) {

    return "--";

  }

  return new Date(
    value,
  ).toLocaleString();

}

export function firstLines(
  text: string,
  lines = 3,
): string {

  return text
    .split("\n")
    .slice(0, lines)
    .join("\n");

}

export function formatConfidence(
  confidence: number,
): string {

  return `${Math.round(
    confidence * 100,
  )}%`;

}

export function parseExplanation(
  text: string,
): ExplanationSection[] {

  return text
    .split(/^# /gm)
    .filter(
      (section) =>
        section.trim().length > 0,
    )
    .map(
      (section) => {

        const [
          title,
          ...body
        ] =
          section.split(
            "\n",
          );

        return {
          title:
            title.trim(),
          content:
            body
              .join("\n")
              .trim(),
        };

      },
    );

}