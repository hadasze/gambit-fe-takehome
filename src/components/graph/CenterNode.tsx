import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

export type CenterNodeType = Node<{ label: string }, "center">;

export function CenterNode({ data }: NodeProps<CenterNodeType>) {
  return (
    <div className="graph-node graph-node--center" title={data.label}>
      <Handle type="target" position={Position.Top} className="graph-node__handle" isConnectable={false} />
      <Handle type="source" position={Position.Top} className="graph-node__handle" isConnectable={false} />
      <span className="graph-node__label">{data.label}</span>
    </div>
  );
}
