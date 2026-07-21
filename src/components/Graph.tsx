import { useMemo } from "react";
import { Background, Controls, ReactFlow, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { computeForceLayout } from "../utils/forceLayout";
import { CenterNode, type CenterNodeType } from "./graph/CenterNode";
import { MemberNode, type MemberNodeType } from "./graph/MemberNode";
import { FloatingEdge } from "./graph/FloatingEdge";
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

const CENTER_SIZE = { width: 170, height: 52 };
const MEMBER_SIZE = { width: 150, height: 40 };

const nodeTypes = { center: CenterNode, member: MemberNode };
const edgeTypes = { floating: FloatingEdge };

// Renders a hub-and-spoke graph on React Flow: a force simulation
// (computeForceLayout) spaces the nodes so they never overlap, and
// fitView/pan/zoom keep it legible whether there are 3 members or 50.
export function Graph({ centerLabel, nodes: memberNodes }: GraphProps) {
  const { nodes, edges } = useMemo(() => {
    const layout = computeForceLayout(
      Math.max(CENTER_SIZE.width, CENTER_SIZE.height) / 2,
      memberNodes.map((member) => ({ id: member.id, radius: Math.max(MEMBER_SIZE.width, MEMBER_SIZE.height) / 2 })),
    );

    const centerNode: CenterNodeType = {
      id: layout.center.id,
      type: "center",
      position: { x: layout.center.x - CENTER_SIZE.width / 2, y: layout.center.y - CENTER_SIZE.height / 2 },
      data: { label: centerLabel },
      style: CENTER_SIZE,
      draggable: false,
      selectable: false,
    };

    const memberFlowNodes: MemberNodeType[] = layout.members.map((position, index) => ({
      id: position.id,
      type: "member",
      position: { x: position.x - MEMBER_SIZE.width / 2, y: position.y - MEMBER_SIZE.height / 2 },
      data: { label: memberNodes[index].label, tone: memberNodes[index].tone },
      style: MEMBER_SIZE,
      draggable: false,
      selectable: false,
    }));

    const flowEdges: Edge[] = memberNodes.map((member) => ({
      id: `edge-${member.id}`,
      source: layout.center.id,
      target: member.id,
      type: "floating",
    }));

    return { nodes: [centerNode, ...memberFlowNodes], edges: flowEdges };
  }, [centerLabel, memberNodes]);

  return (
    <div className="graph" role="img" aria-label={`${centerLabel} graph`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnScroll={false}
      >
        <Background gap={16} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
