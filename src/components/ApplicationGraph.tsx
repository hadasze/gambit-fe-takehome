import type { Application, Resource } from "../types/domain";
import { layoutCircle } from "../utils/graphLayout";

interface ApplicationGraphProps {
  application: Application;
  resources: Resource[];
}

const CENTER = { x: 240, y: 190 };
const RADIUS = 140;
const NODE_RADIUS = 26;
const CENTER_RADIUS = 34;

export function ApplicationGraph({ application, resources }: ApplicationGraphProps) {
  const members = application.resourceIds
    .map((id) => resources.find((resource) => resource.id === id))
    .filter((resource): resource is Resource => Boolean(resource));

  const positions = layoutCircle(CENTER, RADIUS, members.length);

  return (
    <svg className="application-graph" viewBox="0 0 480 380" role="img" aria-label={`${application.name} resource graph`}>
      {members.map((member, index) => (
        <line
          key={`edge-${member.id}`}
          x1={CENTER.x}
          y1={CENTER.y}
          x2={positions[index].x}
          y2={positions[index].y}
          className="application-graph__edge"
        />
      ))}

      {members.map((member, index) => {
        const point = positions[index];
        const labelAnchor = point.x < CENTER.x - 10 ? "end" : point.x > CENTER.x + 10 ? "start" : "middle";
        return (
          <g key={member.id}>
            <circle
              cx={point.x}
              cy={point.y}
              r={NODE_RADIUS}
              className={`application-graph__node application-graph__node--${member.criticality}`}
            />
            <text
              x={point.x}
              y={point.y + NODE_RADIUS + 14}
              textAnchor={labelAnchor === "middle" ? "middle" : labelAnchor}
              className="application-graph__label"
            >
              {member.name}
            </text>
          </g>
        );
      })}

      <circle cx={CENTER.x} cy={CENTER.y} r={CENTER_RADIUS} className="application-graph__center" />
      <text x={CENTER.x} y={CENTER.y} textAnchor="middle" className="application-graph__center-label">
        {application.name}
      </text>
    </svg>
  );
}
