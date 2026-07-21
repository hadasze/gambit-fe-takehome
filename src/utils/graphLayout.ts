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
