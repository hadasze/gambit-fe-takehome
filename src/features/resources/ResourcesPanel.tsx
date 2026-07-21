import { useResourceFilters, type ResourceFilters } from "../../hooks/useResourceFilters";
import { Filters, Table as ResourceTable, type FilterSelectConfig } from "../../components";
import { CRITICALITIES, ENVIRONMENTS, PROVIDERS } from "../../data/filterOptions";
import { resourceColumns } from "./columns";
import type { Resource } from "../../types/domain";

interface ResourcesPanelProps {
  resources: Resource[];
  selectedIds: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
}

function toOptions(values: readonly string[], allLabel: string) {
  return [{ value: "all", label: allLabel }, ...values.map((value) => ({ value, label: value }))];
}

export function ResourcesPanel({ resources, selectedIds, onToggleRow, onToggleAll }: ResourcesPanelProps) {
  const { filters, updateFilter, resetFilters, filteredResources } = useResourceFilters(resources);

  const selects: FilterSelectConfig[] = [
    { key: "provider", value: filters.provider, options: toOptions(PROVIDERS, "All providers") },
    { key: "environment", value: filters.environment, options: toOptions(ENVIRONMENTS, "All environments") },
    { key: "criticality", value: filters.criticality, options: toOptions(CRITICALITIES, "All criticality") },
  ];

  const handleSelectChange = (key: string, value: string) => {
    switch (key) {
      case "provider":
        updateFilter("provider", value as ResourceFilters["provider"]);
        break;
      case "environment":
        updateFilter("environment", value as ResourceFilters["environment"]);
        break;
      case "criticality":
        updateFilter("criticality", value as ResourceFilters["criticality"]);
        break;
    }
  };

  return (
    <section className="app__resources">
      <Filters
        searchValue={filters.query}
        onSearchChange={(value) => updateFilter("query", value)}
        searchPlaceholder="Search by name…"
        selects={selects}
        onSelectChange={handleSelectChange}
        onReset={resetFilters}
        resultCount={filteredResources.length}
      />
      <ResourceTable
        columns={resourceColumns}
        rows={filteredResources}
        getRowId={(resource) => resource.id}
        getRowLabel={(resource) => resource.name}
        selectedIds={selectedIds}
        onToggleRow={onToggleRow}
        onToggleAll={onToggleAll}
        emptyMessage="No resources match the current filters."
      />
    </section>
  );
}
