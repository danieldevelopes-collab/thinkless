import type { Graph, Priority, SpatialNode } from "../types";
import { buildAdjacency, descendants, findCycleNodes, prerequisitesOf } from "./graph";
import { daysUntil } from "./format";

const PRIORITY_WEIGHT: Record<Priority, number> = {
  low: 0.15,
  medium: 0.4,
  high: 0.7,
  critical: 1,
};

export function isDone(n: SpatialNode): boolean {
  return n.status === "done";
}

/**
 * Deadline pressure in roughly [0, 1.4]: ~0 when far away or undated,
 * rising as the due date approaches, and > 1 when overdue.
 */
export function deadlinePressure(dueDate: string | null | undefined, now: number): number {
  const d = daysUntil(dueDate, now);
  if (d === null) return 0;
  if (d <= 0) return Math.min(1.4, 1.2 + -d * 0.02); // overdue
  if (d >= 21) return 0.05;
  return Math.max(0.1, 1 - d / 21);
}

/** Incomplete, not manually blocked, and every prerequisite is done. */
export function isActionable(graph: Graph, node: SpatialNode, doneIds: Set<string>): boolean {
  if (node.status === "done" || node.status === "blocked") return false;
  return prerequisitesOf(graph, node.id).every((p) => doneIds.has(p));
}

export interface ScoreResult {
  score: number;
  reasons: string[];
}

export function scoreNode(
  graph: Graph,
  node: SpatialNode,
  now: number,
  adj = buildAdjacency(graph)
): ScoreResult {
  const priority = PRIORITY_WEIGHT[node.priority];
  const pressure = deadlinePressure(node.dueDate, now);
  const leverage = descendants(graph, node.id, adj).size;
  const leverageScore = Math.min(1, leverage / 5);

  const score = priority * 1.0 + pressure * 1.2 + leverageScore * 0.8;

  const reasons: string[] = [];
  if (node.priority === "critical" || node.priority === "high") {
    reasons.push(`${node.priority} priority`);
  }
  if (pressure >= 1) reasons.push("overdue");
  else if (pressure >= 0.5) reasons.push("due soon");
  if (leverage > 0) reasons.push(`unblocks ${leverage} task${leverage === 1 ? "" : "s"}`);

  return { score, reasons };
}

export interface FrontierItem {
  node: SpatialNode;
  score: number;
  reasons: string[];
}

/** Actionable nodes right now, best first. Deterministic tie-break by id. */
export function frontier(graph: Graph, now: number): FrontierItem[] {
  const adj = buildAdjacency(graph);
  const doneIds = new Set(graph.nodes.filter(isDone).map((n) => n.id));
  return graph.nodes
    .filter((n) => isActionable(graph, n, doneIds))
    .map((n) => {
      const { score, reasons } = scoreNode(graph, n, now, adj);
      return { node: n, score, reasons };
    })
    .sort((a, b) => b.score - a.score || a.node.id.localeCompare(b.node.id));
}

/**
 * The Momentum Path: greedily take the best actionable node, "complete" it,
 * recompute the frontier (which may unlock new nodes), and repeat. This yields
 * an ordered route — "do A, which unlocks C, then D" — with no AI, just logic.
 */
export function momentumPath(graph: Graph, now: number, maxLen = 6): SpatialNode[] {
  const adj = buildAdjacency(graph);
  const doneIds = new Set(graph.nodes.filter(isDone).map((n) => n.id));
  const path: SpatialNode[] = [];

  while (path.length < maxLen) {
    const candidates = graph.nodes
      .filter((n) => !doneIds.has(n.id) && isActionable(graph, n, doneIds))
      .map((n) => ({ n, s: scoreNode(graph, n, now, adj).score }))
      .sort((a, b) => b.s - a.s || a.n.id.localeCompare(b.n.id));
    if (candidates.length === 0) break;
    const next = candidates[0].n;
    path.push(next);
    doneIds.add(next.id);
  }
  return path;
}

/** Incomplete nodes that are manually blocked OR have an incomplete prerequisite. */
export function blockedNodes(graph: Graph): SpatialNode[] {
  const doneIds = new Set(graph.nodes.filter(isDone).map((n) => n.id));
  return graph.nodes.filter((n) => {
    if (n.status === "done") return false;
    if (n.status === "blocked") return true;
    return prerequisitesOf(graph, n.id).some((p) => !doneIds.has(p));
  });
}

export { findCycleNodes };
