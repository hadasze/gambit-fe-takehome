import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { BadgeTone } from "../Badge";

export type MemberNodeType = Node<{ label: string; tone?: BadgeTone }, "member">;

export function MemberNode({ data }: NodeProps<MemberNodeType>) {
  return (
    <div className={`graph-node graph-node--member graph-node--${data.tone ?? "neutral"}`} title={data.label}>
      <Handle type="target" position={Position.Top} className="graph-node__handle" isConnectable={false} />
      <Handle type="source" position={Position.Top} className="graph-node__handle" isConnectable={false} />
      <span className="graph-node__label">{data.label}</span>
    </div>
  );
}
