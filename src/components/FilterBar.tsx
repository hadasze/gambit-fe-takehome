import type { ResourceFilters } from "../hooks/useResourceFilters";
import { CRITICALITIES, ENVIRONMENTS, PROVIDERS } from "../data/filterOptions";

interface FilterBarProps {
  filters: ResourceFilters;
  onChange: <K extends keyof ResourceFilters>(key: K, value: ResourceFilters[K]) => void;
  onReset: () => void;
  resultCount: number;
}

export function FilterBar({ filters, onChange, onReset, resultCount }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <input
        type="text"
        className="filter-bar__search"
        placeholder="Search by name…"
        value={filters.query}
        onChange={(event) => onChange("query", event.target.value)}
      />

      <select
        value={filters.provider}
        onChange={(event) => onChange("provider", event.target.value as ResourceFilters["provider"])}
      >
        <option value="all">All providers</option>
        {PROVIDERS.map((provider) => (
          <option key={provider} value={provider}>
            {provider}
          </option>
        ))}
      </select>

      <select
        value={filters.environment}
        onChange={(event) =>
          onChange("environment", event.target.value as ResourceFilters["environment"])
        }
      >
        <option value="all">All environments</option>
        {ENVIRONMENTS.map((environment) => (
          <option key={environment} value={environment}>
            {environment}
          </option>
        ))}
      </select>

      <select
        value={filters.criticality}
        onChange={(event) =>
          onChange("criticality", event.target.value as ResourceFilters["criticality"])
        }
      >
        <option value="all">All criticality</option>
        {CRITICALITIES.map((criticality) => (
          <option key={criticality} value={criticality}>
            {criticality}
          </option>
        ))}
      </select>

      <button type="button" className="filter-bar__reset" onClick={onReset}>
        Reset
      </button>

      <span className="filter-bar__count">{resultCount} resources</span>
    </div>
  );
}
