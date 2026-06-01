import type { NodeType, Priority, Status } from "../types";

export type TypeShape =
  | "rect"
  | "hex"
  | "circle"
  | "diamond"
  | "spark"
  | "split"
  | "triangle"
  | "pill";

export interface TypeMeta {
  label: string;
  color: string;
  shape: TypeShape;
}

export const NODE_TYPE_META: Record<NodeType, TypeMeta> = {
  task: { label: "Task", color: "#6ea8fe", shape: "rect" },
  goal: { label: "Goal", color: "#39d98a", shape: "hex" },
  milestone: { label: "Milestone", color: "#b692ff", shape: "circle" },
  blocker: { label: "Blocker", color: "#ff7a90", shape: "diamond" },
  idea: { label: "Idea", color: "#f4b740", shape: "spark" },
  decision: { label: "Decision", color: "#56d6d6", shape: "split" },
  risk: { label: "Risk", color: "#ff9f59", shape: "triangle" },
  person: { label: "Person", color: "#9aa7ff", shape: "pill" },
};

export const NODE_TYPE_ORDER: NodeType[] = [
  "task",
  "goal",
  "milestone",
  "blocker",
  "idea",
  "decision",
  "risk",
  "person",
];

export const PRIORITY_META: Record<Priority, { label: string; color: string }> = {
  low: { label: "Low", color: "#7f8aa0" },
  medium: { label: "Medium", color: "#6ea8fe" },
  high: { label: "High", color: "#f4b740" },
  critical: { label: "Critical", color: "#ff7a90" },
};

export const STATUS_META: Record<Status, { label: string; color: string }> = {
  todo: { label: "To do", color: "#9aa7bd" },
  active: { label: "Active", color: "#6ea8fe" },
  blocked: { label: "Blocked", color: "#ff7a90" },
  done: { label: "Done", color: "#39d98a" },
};
