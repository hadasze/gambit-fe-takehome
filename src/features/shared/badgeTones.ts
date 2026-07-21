import type { BadgeTone } from "../../components";
import type { Criticality, Provider } from "../../types/domain";

export const criticalityTone: Record<Criticality, BadgeTone> = {
  low: "green",
  medium: "amber",
  high: "orange",
  critical: "red",
};

export const criticalityLabel: Record<Criticality, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const providerTone: Record<Provider, BadgeTone> = {
  AWS: "amber",
  GCP: "blue",
  Azure: "cyan",
};
