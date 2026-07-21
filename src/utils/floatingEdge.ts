import type { InternalNode, Node } from "@xyflow/react";

function getNodeCenter(node: InternalNode<Node>) {
  const { x, y } = node.internals.positionAbsolute;
  return {
    x: x + (node.measured.width ?? 0) / 2,
    y: y + (node.measured.height ?? 0) / 2,
  };
}

// Where the line from `node`'s center toward `target`'s center crosses
// `node`'s rectangular boundary — lets edges "float" and attach from
// whichever side actually faces the other node, instead of a fixed handle.
function getBoundaryPoint(node: InternalNode<Node>, target: InternalNode<Node>) {
  const halfWidth = (node.measured.width ?? 0) / 2;
  const halfHeight = (node.measured.height ?? 0) / 2;
  const center = getNodeCenter(node);
  const targetCenter = getNodeCenter(target);

  const dx = targetCenter.x - center.x;
  const dy = targetCenter.y - center.y;
  if (dx === 0 && dy === 0) return center;

  const scale = 1 / Math.max(Math.abs(dx) / halfWidth, Math.abs(dy) / halfHeight);
  return { x: center.x + dx * scale, y: center.y + dy * scale };
}

export function getFloatingEdgeParams(source: InternalNode<Node>, target: InternalNode<Node>) {
  const sourcePoint = getBoundaryPoint(source, target);
  const targetPoint = getBoundaryPoint(target, source);
  return { sx: sourcePoint.x, sy: sourcePoint.y, tx: targetPoint.x, ty: targetPoint.y };
}
