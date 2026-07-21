import { layoutCircle } from "../utils/graphLayout";
import type { BadgeTone } from "./Badge";

export interface GraphNode {
  id: string;
  label: string;
  tone?: BadgeTone;
}

interface GraphProps {
  centerLabel: string;
  nodes: GraphNode[];
}

const CENTER = { x: 240, y: 190 };
const RADIUS = 140;
const NODE_RADIUS = 26;
const CENTER_RADIUS = 34;

// Generic radial graph: one center node connected to a ring of member nodes.
export function Graph({ centerLabel, nodes }: GraphProps) {
  const positions = layoutCircle(CENTER, RADIUS, nodes.length);

  return (
    <svg className="graph" viewBox="0 0 480 380" role="img" aria-label={`${centerLabel} graph`}>
      {nodes.map((node, index) => (
        <line
          key={`edge-${node.id}`}
          x1={CENTER.x}
          y1={CENTER.y}
          x2={positions[index].x}
          y2={positions[index].y}
          className="graph__edge"
        />
      ))}

      {nodes.map((node, index) => {
        const point = positions[index];
        const anchor = point.x < CENTER.x - 10 ? "end" : point.x > CENTER.x + 10 ? "start" : "middle";
        return (
          <g key={node.id}>
            <circle
              cx={point.x}
              cy={point.y}
              r={NODE_RADIUS}
              className={`graph__node graph__node--${node.tone ?? "neutral"}`}
            />
            <text x={point.x} y={point.y + NODE_RADIUS + 14} textAnchor={anchor} className="graph__label">
              {node.label}
            </text>
          </g>
        );
      })}

      <circle cx={CENTER.x} cy={CENTER.y} r={CENTER_RADIUS} className="graph__center" />
      <text x={CENTER.x} y={CENTER.y} textAnchor="middle" className="graph__center-label">
        {centerLabel}
      </text>
    </svg>
  );
}
