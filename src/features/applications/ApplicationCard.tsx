import { Badge, Graph as ApplicationGraph } from "../../components";
import type { Application, Criticality, Resource } from "../../types/domain";
import { criticalityLabel, criticalityTone } from "../shared/badgeTones";

interface ApplicationCardProps {
  application: Application;
  resources: Resource[];
  onDelete: (id: string) => void;
}

function countByCriticality(members: Resource[]): [Criticality, number][] {
  const counts: Partial<Record<Criticality, number>> = {};
  for (const resource of members) {
    counts[resource.criticality] = (counts[resource.criticality] ?? 0) + 1;
  }
  return Object.entries(counts) as [Criticality, number][];
}

export function ApplicationCard({ application, resources, onDelete }: ApplicationCardProps) {
  const members = application.resourceIds
    .map((id) => resources.find((resource) => resource.id === id))
    .filter((resource): resource is Resource => Boolean(resource));

  return (
    <article className="app-card">
      <div className="app-card__header">
        <h3 className="app-card__title">{application.name}</h3>
        <button
          type="button"
          className="app-card__delete"
          onClick={() => onDelete(application.id)}
          aria-label={`Delete ${application.name}`}
        >
          Delete
        </button>
      </div>

      <div className="app-card__meta">
        <span className="text-muted">
          {members.length} resource{members.length === 1 ? "" : "s"}
        </span>
        {countByCriticality(members).map(([level, count]) => (
          <Badge key={level} tone={criticalityTone[level]}>
            {count} {criticalityLabel[level]}
          </Badge>
        ))}
      </div>

      {application.description && <p className="text-muted app-card__description">{application.description}</p>}

      <div className="app-card__graph">
        <ApplicationGraph
          centerLabel={application.name}
          nodes={members.map((resource) => ({
            id: resource.id,
            label: resource.name,
            tone: criticalityTone[resource.criticality],
          }))}
        />
      </div>
    </article>
  );
}
