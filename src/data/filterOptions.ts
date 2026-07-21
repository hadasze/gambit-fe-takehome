import type { Criticality, Environment, Provider } from "../types/domain";

// Central place to extend the filter dropdowns when the domain types grow.
export const PROVIDERS: Provider[] = ["AWS", "GCP", "Azure"];
export const ENVIRONMENTS: Environment[] = ["production", "staging", "development"];
export const CRITICALITIES: Criticality[] = ["low", "medium", "high", "critical"];
