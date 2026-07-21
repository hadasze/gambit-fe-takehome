import type { Application, Resource } from "../types/domain";
import { ApplicationGraph } from "./ApplicationGraph";

interface ApplicationsListProps {
  applications: Application[];
  resources: Resource[];
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
}

export function ApplicationsList({
  applications,
  resources,
  expandedId,
  onToggleExpand,
}: ApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <p className="applications-list__empty">
        No applications yet. Select resources in the table and group them into one.
      </p>
    );
  }

  return (
    <ul className="applications-list">
      {applications.map((application) => {
        const isExpanded = expandedId === application.id;
        return (
          <li key={application.id} className="applications-list__item">
            <button
              type="button"
              className="applications-list__header"
              onClick={() => onToggleExpand(application.id)}
              aria-expanded={isExpanded}
            >
              <div>
                <span className="applications-list__name">{application.name}</span>
                <span className="applications-list__count">
                  {application.resourceIds.length} resource
                  {application.resourceIds.length === 1 ? "" : "s"}
                </span>
              </div>
              <span className="applications-list__chevron">{isExpanded ? "−" : "+"}</span>
            </button>

            {application.description && (
              <p className="applications-list__description">{application.description}</p>
            )}

            {isExpanded && <ApplicationGraph application={application} resources={resources} />}
          </li>
        );
      })}
    </ul>
  );
}
