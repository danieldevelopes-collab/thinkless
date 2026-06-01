import type { Graph, SpatialEdge } from "../types";

export function dependsEdges(graph: Graph): SpatialEdge[] {
  return graph.edges.filter((e) => e.kind === "depends");
}

/** Nodes that must be done before `nodeId` (incoming `depends`). */
export function prerequisitesOf(graph: Graph, nodeId: string): string[] {
  return dependsEdges(graph)
    .filter((e) => e.to === nodeId)
    .map((e) => e.from);
}

/** Nodes that depend on `nodeId` (outgoing `depends`). */
export function dependentsOf(graph: Graph, nodeId: string): string[] {
  return dependsEdges(graph)
    .filter((e) => e.from === nodeId)
    .map((e) => e.to);
}

export interface Adjacency {
  /** prerequisite id -> [dependent ids] */
  forward: Map<string, string[]>;
  /** node id -> [prerequisite ids] */
  backward: Map<string, string[]>;
}

export function buildAdjacency(graph: Graph): Adjacency {
  const forward = new Map<string, string[]>();
  const backward = new Map<string, string[]>();
  for (const n of graph.nodes) {
    forward.set(n.id, []);
    backward.set(n.id, []);
  }
  for (const e of dependsEdges(graph)) {
    if (!forward.has(e.from) || !backward.has(e.to)) continue;
    forward.get(e.from)!.push(e.to);
    backward.get(e.to)!.push(e.from);
  }
  return { forward, backward };
}

/** All transitive dependents (downstream) of a node. */
export function descendants(
  graph: Graph,
  nodeId: string,
  adj: Adjacency = buildAdjacency(graph)
): Set<string> {
  const seen = new Set<string>();
  const stack = [...(adj.forward.get(nodeId) ?? [])];
  while (stack.length) {
    const cur = stack.pop()!;
    if (seen.has(cur)) continue;
    seen.add(cur);
    for (const nxt of adj.forward.get(cur) ?? []) {
      if (!seen.has(nxt)) stack.push(nxt);
    }
  }
  return seen;
}

/** Set of node ids that participate in a dependency cycle (DFS coloring). */
export function findCycleNodes(
  graph: Graph,
  adj: Adjacency = buildAdjacency(graph)
): Set<string> {
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const color = new Map<string, number>();
  for (const n of graph.nodes) color.set(n.id, WHITE);
  const inCycle = new Set<string>();
  const stack: string[] = [];

  const dfs = (u: string) => {
    color.set(u, GRAY);
    stack.push(u);
    for (const v of adj.forward.get(u) ?? []) {
      if (color.get(v) === GRAY) {
        const idx = stack.lastIndexOf(v);
        for (let i = idx; i < stack.length; i++) inCycle.add(stack[i]);
      } else if (color.get(v) === WHITE) {
        dfs(v);
      }
    }
    stack.pop();
    color.set(u, BLACK);
  };

  for (const n of graph.nodes) {
    if (color.get(n.id) === WHITE) dfs(n.id);
  }
  return inCycle;
}
