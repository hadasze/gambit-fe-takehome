import { getStraightPath, useInternalNode, type EdgeProps } from "@xyflow/react";
import { getFloatingEdgeParams } from "../../utils/floatingEdge";

// An edge whose endpoints are computed from the two nodes' actual
// positions rather than a fixed handle side — needed because our radial
// layout connects nodes in every direction, not just top-to-bottom.
export function FloatingEdge({ source, target, markerEnd, style }: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) return null;

  const { sx, sy, tx, ty } = getFloatingEdgeParams(sourceNode, targetNode);
  const [path] = getStraightPath({ sourceX: sx, sourceY: sy, targetX: tx, targetY: ty });

  return <path className="graph__edge" d={path} markerEnd={markerEnd} style={style} />;
}
