export type NodeType =
  | "task"
  | "goal"
  | "milestone"
  | "blocker"
  | "idea"
  | "decision"
  | "risk"
  | "person";

export type Status = "todo" | "active" | "blocked" | "done";
export type Priority = "low" | "medium" | "high" | "critical";

export interface SpatialNode {
  id: string;
  type: NodeType;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  /** ISO date (yyyy-mm-dd) or null */
  dueDate?: string | null;
  x: number;
  y: number;
  tags: string[];
  notes?: string;
}

export type EdgeKind = "depends" | "relates";

/**
 * A `depends` edge { from, to } means `from` must be completed before `to`.
 * So `from` is a prerequisite of `to`, and `to` depends on `from`.
 * A `relates` edge is a non-blocking association.
 */
export interface SpatialEdge {
  id: string;
  from: string;
  to: string;
  kind: EdgeKind;
}

export interface Graph {
  nodes: SpatialNode[];
  edges: SpatialEdge[];
}
