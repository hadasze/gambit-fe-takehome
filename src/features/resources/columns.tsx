import type { Resource } from "../../types/domain";
import { Badge, type Column } from "../../components";
import { criticalityLabel, criticalityTone, providerTone } from "../shared/badgeTones";

export const resourceColumns: Column<Resource>[] = [
  {
    key: "name",
    header: "Name",
    render: (resource) => <span className="text-strong">{resource.name}</span>,
  },
  {
    key: "type",
    header: "Type",
    render: (resource) => resource.type,
  },
  {
    key: "provider",
    header: "Provider",
    render: (resource) => <Badge tone={providerTone[resource.provider]}>{resource.provider}</Badge>,
  },
  {
    key: "environment",
    header: "Environment",
    render: (resource) => resource.environment,
  },
  {
    key: "criticality",
    header: "Criticality",
    render: (resource) => (
      <Badge tone={criticalityTone[resource.criticality]}>{criticalityLabel[resource.criticality]}</Badge>
    ),
  },
  {
    key: "openIssues",
    header: "Open issues",
    align: "right",
    render: (resource) => (resource.openIssues > 0 ? resource.openIssues : "–"),
  },
];
