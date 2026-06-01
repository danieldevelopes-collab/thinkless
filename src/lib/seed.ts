import type { Graph } from "../types";

/**
 * A curated demo workspace shown in guest mode. Designed so the Momentum Path,
 * blocked nodes, and deadline-pressure glow are all immediately visible.
 * Due dates sit around early/mid June 2026 so pressure reads clearly.
 */
export function seedGraph(): Graph {
  return {
    nodes: [
      { id: "g1", type: "goal", title: "Launch SpatialWave v1", status: "todo", priority: "critical", dueDate: "2026-06-25", x: 640, y: 24, tags: ["release"] },
      { id: "m1", type: "milestone", title: "Public beta", status: "todo", priority: "high", dueDate: "2026-06-18", x: 640, y: 300, tags: ["beta"] },
      { id: "t1", type: "task", title: "Design spatial canvas UI", status: "done", priority: "high", dueDate: "2026-05-28", x: 120, y: 180, tags: ["ui"] },
      { id: "d1", type: "decision", title: "1-doc vs doc-per-node storage", status: "done", priority: "medium", dueDate: "2026-05-30", x: 120, y: 320, tags: ["architecture"] },
      { id: "t2", type: "task", title: "Build node editor panel", status: "active", priority: "high", dueDate: "2026-06-05", x: 360, y: 130, tags: ["ui"] },
      { id: "t3", type: "task", title: "Momentum Path engine", status: "todo", priority: "critical", dueDate: "2026-06-04", x: 360, y: 300, tags: ["logic"] },
      { id: "t4", type: "task", title: "Completion wave animations", status: "todo", priority: "medium", dueDate: "2026-06-10", x: 360, y: 470, tags: ["ui"] },
      { id: "b1", type: "blocker", title: "Firebase quota review", status: "blocked", priority: "high", dueDate: "2026-06-02", x: 120, y: 470, tags: ["infra"] },
      { id: "t5", type: "task", title: "Firestore persistence (1-doc)", status: "todo", priority: "high", dueDate: "2026-06-12", x: 600, y: 470, tags: ["backend"] },
      { id: "t6", type: "task", title: "README + screenshots", status: "todo", priority: "medium", dueDate: "2026-06-20", x: 600, y: 600, tags: ["docs"] },
      { id: "t7", type: "task", title: "Deploy + CI/CD", status: "todo", priority: "high", dueDate: "2026-06-22", x: 860, y: 560, tags: ["devops"] },
      { id: "i1", type: "idea", title: "Optional 3D zone view", status: "todo", priority: "low", x: 880, y: 200, tags: ["future"] },
      { id: "r1", type: "risk", title: "Spark read-limit spikes", status: "todo", priority: "medium", x: 880, y: 380, tags: ["risk"] },
      { id: "p1", type: "person", title: "Recruiter demo walkthrough", status: "todo", priority: "low", dueDate: "2026-06-26", x: 880, y: 40, tags: ["portfolio"] },
    ],
    edges: [
      { id: "e1", from: "t1", to: "t2", kind: "depends" },
      { id: "e2", from: "t1", to: "t4", kind: "depends" },
      { id: "e3", from: "d1", to: "t3", kind: "depends" },
      { id: "e4", from: "t2", to: "m1", kind: "depends" },
      { id: "e5", from: "t3", to: "m1", kind: "depends" },
      { id: "e6", from: "t4", to: "m1", kind: "depends" },
      { id: "e7", from: "b1", to: "t5", kind: "depends" },
      { id: "e8", from: "t5", to: "t7", kind: "depends" },
      { id: "e9", from: "t6", to: "t7", kind: "depends" },
      { id: "e10", from: "m1", to: "g1", kind: "depends" },
      { id: "e11", from: "t7", to: "g1", kind: "depends" },
      { id: "e12", from: "i1", to: "t4", kind: "relates" },
      { id: "e13", from: "r1", to: "t5", kind: "relates" },
    ],
  };
}
