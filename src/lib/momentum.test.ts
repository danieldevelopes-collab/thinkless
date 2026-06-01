import { describe, expect, it } from "vitest";
import type { Graph, Priority, SpatialNode, Status } from "../types";
import {
  blockedNodes,
  deadlinePressure,
  frontier,
  isActionable,
  momentumPath,
} from "./momentum";

const NOW = Date.UTC(2026, 5, 1); // 2026-06-01

function node(id: string, over: Partial<SpatialNode> = {}): SpatialNode {
  return {
    id,
    type: "task",
    title: id,
    status: "todo",
    priority: "medium",
    x: 0,
    y: 0,
    tags: [],
    ...over,
  };
}
function dep(from: string, to: string): Graph["edges"][number] {
  return { id: `${from}-${to}`, from, to, kind: "depends" };
}

describe("deadlinePressure", () => {
  it("is 0 with no due date and rises as the deadline nears", () => {
    const none = deadlinePressure(null, NOW);
    const far = deadlinePressure("2026-08-01", NOW);
    const soon = deadlinePressure("2026-06-03", NOW);
    const overdue = deadlinePressure("2026-05-20", NOW);
    expect(none).toBe(0);
    expect(far).toBeLessThan(soon);
    expect(soon).toBeLessThan(overdue);
    expect(overdue).toBeGreaterThan(1);
  });
});

describe("isActionable", () => {
  const g: Graph = { nodes: [node("a", { status: "done" }), node("b")], edges: [dep("a", "b")] };
  it("is true when all prerequisites are done", () => {
    expect(isActionable(g, g.nodes[1], new Set(["a"]))).toBe(true);
  });
  it("is false when a prerequisite is incomplete", () => {
    expect(isActionable(g, g.nodes[1], new Set())).toBe(false);
  });
  it("is false for done or blocked nodes", () => {
    expect(isActionable(g, node("c", { status: "done" }), new Set())).toBe(false);
    expect(isActionable(g, node("c", { status: "blocked" }), new Set())).toBe(false);
  });
});

describe("frontier ordering", () => {
  it("ranks by priority when deadlines are equal", () => {
    const g: Graph = {
      nodes: [node("low", { priority: "low" as Priority }), node("crit", { priority: "critical" as Priority })],
      edges: [],
    };
    expect(frontier(g, NOW)[0].node.id).toBe("crit");
  });

  it("lets deadline pressure raise a task above an un-dated one", () => {
    const g: Graph = {
      nodes: [node("calm", { priority: "medium" }), node("urgent", { priority: "medium", dueDate: "2026-06-02" })],
      edges: [],
    };
    expect(frontier(g, NOW)[0].node.id).toBe("urgent");
  });
});

describe("momentumPath", () => {
  it("simulates completion to unlock a downstream chain", () => {
    // a -> b -> c ; only `a` is actionable initially.
    const g: Graph = {
      nodes: [node("a"), node("b"), node("c")],
      edges: [dep("a", "b"), dep("b", "c")],
    };
    const path = momentumPath(g, NOW).map((p) => p.id);
    expect(path).toEqual(["a", "b", "c"]);
  });

  it("does not include manually blocked nodes", () => {
    const g: Graph = {
      nodes: [node("a", { status: "blocked" as Status }), node("b")],
      edges: [],
    };
    expect(momentumPath(g, NOW).map((p) => p.id)).toEqual(["b"]);
  });
});

describe("blockedNodes", () => {
  it("includes manually blocked and dependency-blocked nodes", () => {
    const g: Graph = {
      nodes: [node("a"), node("b"), node("blk", { status: "blocked" as Status })],
      edges: [dep("a", "b")], // b is blocked by incomplete a
    };
    const ids = blockedNodes(g)
      .map((x) => x.id)
      .sort();
    expect(ids).toEqual(["b", "blk"]);
  });
});
