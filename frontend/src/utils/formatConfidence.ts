export function formatConfidence(value: number): string {
  const confidence = Math.max(0, Math.min(1, value));

  return `${Math.round(confidence * 100)}%`;
}

export function confidenceLabel(value: number): string {
  const confidence = Math.max(0, Math.min(1, value));

  if (confidence >= 0.9) {
    return "Very High";
  }

  if (confidence >= 0.75) {
    return "High";
  }

  if (confidence >= 0.5) {
    return "Moderate";
  }

  if (confidence >= 0.25) {
    return "Low";
  }

  return "Very Low";
}