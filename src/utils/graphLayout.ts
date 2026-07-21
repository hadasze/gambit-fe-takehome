export interface Point {
  x: number;
  y: number;
}

// Places `count` points evenly around a circle so a graph component can stay
// focused on rendering rather than trigonometry.
export function layoutCircle(center: Point, radius: number, count: number): Point[] {
  if (count === 0) return [];

  return Array.from({ length: count }, (_, index) => {
    const angle = (2 * Math.PI * index) / count - Math.PI / 2;
    return {
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    };
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export interface RingMetrics {
  radius: number;
  nodeRadius: number;
  labelMaxChars: number;
}

const BASE_RADIUS = 140;
const BASE_NODE_RADIUS = 26;
const MIN_NODE_RADIUS = 14;
const BASE_LABEL_CHARS = 20;
const MIN_LABEL_CHARS = 10;
const DENSE_FROM_COUNT = 8;

// As more nodes join the ring, shrink each node and its label a little and
// widen the ring just enough to keep them from overlapping.
export function computeRingMetrics(count: number): RingMetrics {
  const overflow = Math.max(0, count - DENSE_FROM_COUNT);
  const nodeRadius = clamp(BASE_NODE_RADIUS - overflow * 0.6, MIN_NODE_RADIUS, BASE_NODE_RADIUS);
  const circumferenceNeeded = (count * (nodeRadius * 2 + 14)) / (2 * Math.PI);
  const radius = Math.max(BASE_RADIUS, circumferenceNeeded);
  const labelMaxChars = clamp(BASE_LABEL_CHARS - overflow, MIN_LABEL_CHARS, BASE_LABEL_CHARS);

  return { radius, nodeRadius, labelMaxChars };
}

export function truncateLabel(label: string, maxChars: number): string {
  return label.length > maxChars ? `${label.slice(0, maxChars - 1)}…` : label;
}
