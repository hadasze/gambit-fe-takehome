import type { Criticality } from "../types/domain";

const LABELS: Record<Criticality, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function CriticalityBadge({ criticality }: { criticality: Criticality }) {
  return <span className={`badge badge--criticality-${criticality}`}>{LABELS[criticality]}</span>;
}
