import { computeRingMetrics, layoutCircle, truncateLabel } from "../utils/graphLayout";
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

const CENTER_RADIUS = 34;
const MARGIN = 50;

// Generic radial graph: one center node connected to a ring of member nodes.
// The ring radius and node size adapt to the node count so it stays legible
// whether there are 3 members or 30.
export function Graph({ centerLabel, nodes }: GraphProps) {
  const { radius, nodeRadius, labelMaxChars } = computeRingMetrics(nodes.length);
  const half = radius + nodeRadius + MARGIN;
  const center = { x: half, y: half };
  const positions = layoutCircle(center, radius, nodes.length);

  return (
    <svg className="graph" viewBox={`0 0 ${half * 2} ${half * 2}`} role="img" aria-label={`${centerLabel} graph`}>
      {nodes.map((node, index) => (
        <line
          key={`edge-${node.id}`}
          x1={center.x}
          y1={center.y}
          x2={positions[index].x}
          y2={positions[index].y}
          className="graph__edge"
        />
      ))}

      {nodes.map((node, index) => {
        const point = positions[index];
        const anchor = point.x < center.x - 10 ? "end" : point.x > center.x + 10 ? "start" : "middle";
        return (
          <g key={node.id}>
            <title>{node.label}</title>
            <circle
              cx={point.x}
              cy={point.y}
              r={nodeRadius}
              className={`graph__node graph__node--${node.tone ?? "neutral"}`}
            />
            <text x={point.x} y={point.y + nodeRadius + 14} textAnchor={anchor} className="graph__label">
              {truncateLabel(node.label, labelMaxChars)}
            </text>
          </g>
        );
      })}

      <circle cx={center.x} cy={center.y} r={CENTER_RADIUS} className="graph__center" />
      <text x={center.x} y={center.y} textAnchor="middle" className="graph__center-label">
        {truncateLabel(centerLabel, 16)}
      </text>
    </svg>
  );
}
