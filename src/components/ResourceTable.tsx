import type { Resource } from "../types/domain";
import { CriticalityBadge } from "./CriticalityBadge";
import { ProviderBadge } from "./ProviderBadge";

interface ResourceTableProps {
  resources: Resource[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
}

export function ResourceTable({ resources, selectedIds, onToggle, onToggleAll }: ResourceTableProps) {
  const visibleIds = resources.map((resource) => resource.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));

  if (resources.length === 0) {
    return <p className="resource-table__empty">No resources match the current filters.</p>;
  }

  return (
    <table className="resource-table">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={() => onToggleAll(visibleIds)}
              aria-label="Select all visible resources"
            />
          </th>
          <th>Name</th>
          <th>Type</th>
          <th>Provider</th>
          <th>Environment</th>
          <th>Criticality</th>
          <th>Open issues</th>
        </tr>
      </thead>
      <tbody>
        {resources.map((resource) => (
          <tr key={resource.id} className={selectedIds.has(resource.id) ? "is-selected" : undefined}>
            <td>
              <input
                type="checkbox"
                checked={selectedIds.has(resource.id)}
                onChange={() => onToggle(resource.id)}
                aria-label={`Select ${resource.name}`}
              />
            </td>
            <td className="resource-table__name">{resource.name}</td>
            <td>{resource.type}</td>
            <td>
              <ProviderBadge provider={resource.provider} />
            </td>
            <td>{resource.environment}</td>
            <td>
              <CriticalityBadge criticality={resource.criticality} />
            </td>
            <td className="resource-table__issues">
              {resource.openIssues > 0 ? resource.openIssues : "–"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
