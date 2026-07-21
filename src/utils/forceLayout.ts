import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";

interface SimNode extends SimulationNodeDatum {
  id: string;
  radius: number;
}

type SimLink = SimulationLinkDatum<SimNode>;

export interface ForcePosition {
  id: string;
  x: number;
  y: number;
}

const CENTER_ID = "__center__";
const SIMULATION_TICKS = 300;

// Runs a short-lived, deterministic force simulation so a hub-and-spoke
// graph (one center connected to N members) spaces itself out without
// overlap, however many members it has — no manual radius math required.
export function computeForceLayout(
  centerRadius: number,
  members: { id: string; radius: number }[],
): { center: ForcePosition; members: ForcePosition[] } {
  const nodes: SimNode[] = [
    { id: CENTER_ID, radius: centerRadius },
    ...members.map((member) => ({ id: member.id, radius: member.radius })),
  ];
  const links: SimLink[] = members.map((member) => ({ source: CENTER_ID, target: member.id }));

  const simulation = forceSimulation(nodes)
    .force(
      "link",
      forceLink<SimNode, SimLink>(links)
        .id((node) => node.id)
        .distance(110)
        .strength(0.6),
    )
    .force("charge", forceManyBody().strength(-160))
    .force("collide", forceCollide<SimNode>((node) => node.radius + 16))
    .force("center", forceCenter(0, 0))
    .stop();

  for (let i = 0; i < SIMULATION_TICKS; i++) simulation.tick();

  const [center, ...rest] = nodes;
  return {
    center: { id: center.id, x: center.x ?? 0, y: center.y ?? 0 },
    members: rest.map((node) => ({ id: node.id, x: node.x ?? 0, y: node.y ?? 0 })),
  };
}
