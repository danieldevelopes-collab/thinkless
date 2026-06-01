import { describe, expect, it } from "vitest";
import type { Graph } from "../types";
import { descendants, dependentsOf, findCycleNodes, prerequisitesOf } from "./graph";

function n(id: string): Graph["nodes"][number] {
  return { id, type: "task", title: id, status: "todo", priority: "medium", x: 0, y: 0, tags: [] };
}
function dep(from: string, to: string): Graph["edges"][number] {
  return { id: `${from}-${to}`, from, to, kind: "depends" };
}

describe("graph relationships", () => {
  const g: Graph = {
    nodes: ["a", "b", "c", "d"].map(n),
    edges: [dep("a", "b"), dep("b", "c"), dep("a", "d")],
  };

  it("computes prerequisites (incoming depends)", () => {
    expect(prerequisitesOf(g, "b")).toEqual(["a"]);
    expect(prerequisitesOf(g, "c")).toEqual(["b"]);
    expect(prerequisitesOf(g, "a")).toEqual([]);
  });

  it("computes dependents (outgoing depends)", () => {
    expect(dependentsOf(g, "a").sort()).toEqual(["b", "d"]);
  });

  it("computes transitive descendants", () => {
    expect([...descendants(g, "a")].sort()).toEqual(["b", "c", "d"]);
    expect([...descendants(g, "b")]).toEqual(["c"]);
    expect([...descendants(g, "c")]).toEqual([]);
  });
});

describe("cycle detection", () => {
  it("returns empty for an acyclic graph", () => {
    const g: Graph = { nodes: ["a", "b", "c"].map(n), edges: [dep("a", "b"), dep("b", "c")] };
    expect(findCycleNodes(g).size).toBe(0);
  });

  it("flags every node in a cycle", () => {
    const g: Graph = {
      nodes: ["a", "b", "c", "x"].map(n),
      edges: [dep("a", "b"), dep("b", "c"), dep("c", "a"), dep("x", "a")],
    };
    const cyc = findCycleNodes(g);
    expect([...cyc].sort()).toEqual(["a", "b", "c"]);
    expect(cyc.has("x")).toBe(false);
  });
});
