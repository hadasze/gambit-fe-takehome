import { useMemo, useState } from "react";
import type { Criticality, Environment, Provider, Resource } from "../types/domain";

export interface ResourceFilters {
  query: string;
  provider: Provider | "all";
  environment: Environment | "all";
  criticality: Criticality | "all";
}

const emptyFilters: ResourceFilters = {
  query: "",
  provider: "all",
  environment: "all",
  criticality: "all",
};

function matchesFilters(resource: Resource, filters: ResourceFilters): boolean {
  const nameMatches = resource.name
    .toLowerCase()
    .includes(filters.query.trim().toLowerCase());
  const providerMatches = filters.provider === "all" || resource.provider === filters.provider;
  const environmentMatches =
    filters.environment === "all" || resource.environment === filters.environment;
  const criticalityMatches =
    filters.criticality === "all" || resource.criticality === filters.criticality;

  return nameMatches && providerMatches && environmentMatches && criticalityMatches;
}

// Owns search/filter state for a resource list and derives the filtered result.
// Kept generic over `Resource` fields so new filters can be added without
// touching the components that consume this hook.
export function useResourceFilters(resources: Resource[]) {
  const [filters, setFilters] = useState<ResourceFilters>(emptyFilters);

  const filteredResources = useMemo(
    () => resources.filter((resource) => matchesFilters(resource, filters)),
    [resources, filters],
  );

  const updateFilter = <K extends keyof ResourceFilters>(key: K, value: ResourceFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => setFilters(emptyFilters);

  return { filters, updateFilter, resetFilters, filteredResources };
}
