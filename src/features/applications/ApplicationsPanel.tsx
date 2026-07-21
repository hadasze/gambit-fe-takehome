import { List as ApplicationsList, Graph as ApplicationGraph } from "../../components";
import type { Application, Resource } from "../../types/domain";
import { criticalityTone } from "../shared/badgeTones";

interface ApplicationsPanelProps {
  applications: Application[];
  resources: Resource[];
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
}

export function ApplicationsPanel({ applications, resources, expandedId, onToggleExpand }: ApplicationsPanelProps) {
  return (
    <aside className="app__applications">
      <h2>Applications</h2>
      <ApplicationsList
        items={applications}
        getItemId={(application) => application.id}
        expandedId={expandedId}
        onToggleExpand={onToggleExpand}
        emptyMessage="No applications yet. Select resources in the table and group them into one."
        renderHeader={(application) => (
          <div>
            <span className="list__title">{application.name}</span>
            <span className="list__meta">
              {application.resourceIds.length} resource{application.resourceIds.length === 1 ? "" : "s"}
            </span>
            {application.description && (
              <p className="text-muted list__description">{application.description}</p>
            )}
          </div>
        )}
        renderDetail={(application) => (
          <ApplicationGraph
            centerLabel={application.name}
            nodes={application.resourceIds
              .map((id) => resources.find((resource) => resource.id === id))
              .filter((resource): resource is Resource => Boolean(resource))
              .map((resource) => ({
                id: resource.id,
                label: resource.name,
                tone: criticalityTone[resource.criticality],
              }))}
          />
        )}
      />
    </aside>
  );
}
