import { create } from "zustand";
import type { EdgeKind, Graph, NodeType, SpatialNode, Status } from "../types";
import { seedGraph } from "../lib/seed";
import { dependentsOf } from "../lib/graph";
import { genId } from "../lib/ids";
import { NODE_TYPE_META } from "../lib/nodeTypes";

export type ViewMode = "explore" | "focus";

interface SpatialState {
  graph: Graph;
  selectedId: string | null;
  mode: ViewMode;
  filterStatus: Status | "all";
  rippling: string[];

  setSelected: (id: string | null) => void;
  setMode: (m: ViewMode) => void;
  setFilter: (s: Status | "all") => void;

  addNode: (type: NodeType, at?: { x: number; y: number }) => string;
  updateNode: (id: string, patch: Partial<SpatialNode>) => void;
  moveNode: (id: string, x: number, y: number) => void;
  deleteNode: (id: string) => void;
  completeNode: (id: string) => void;

  addEdge: (from: string, to: string, kind?: EdgeKind) => void;
  removeEdge: (id: string) => void;

  resetDemo: () => void;
}

export const useStore = create<SpatialState>((set, get) => ({
  graph: seedGraph(),
  selectedId: null,
  mode: "explore",
  filterStatus: "all",
  rippling: [],

  setSelected: (selectedId) => set({ selectedId }),
  setMode: (mode) => set({ mode }),
  setFilter: (filterStatus) => set({ filterStatus }),

  addNode: (type, at) => {
    const id = genId(type[0]);
    const node: SpatialNode = {
      id,
      type,
      title: `New ${NODE_TYPE_META[type].label.toLowerCase()}`,
      status: "todo",
      priority: "medium",
      x: at?.x ?? 360 + Math.round((Math.random() - 0.5) * 120),
      y: at?.y ?? 280 + Math.round((Math.random() - 0.5) * 120),
      tags: [],
    };
    set((s) => ({ graph: { ...s.graph, nodes: [...s.graph.nodes, node] }, selectedId: id }));
    return id;
  },

  updateNode: (id, patch) =>
    set((s) => ({
      graph: { ...s.graph, nodes: s.graph.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)) },
    })),

  moveNode: (id, x, y) =>
    set((s) => ({
      graph: { ...s.graph, nodes: s.graph.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)) },
    })),

  deleteNode: (id) =>
    set((s) => ({
      graph: {
        nodes: s.graph.nodes.filter((n) => n.id !== id),
        edges: s.graph.edges.filter((e) => e.from !== id && e.to !== id),
      },
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),

  completeNode: (id) => {
    set((s) => ({
      graph: {
        ...s.graph,
        nodes: s.graph.nodes.map((n) => (n.id === id ? { ...n, status: "done" as Status } : n)),
      },
    }));
    // Chain wave: ripple the node and its direct dependents.
    const ids = [id, ...dependentsOf(get().graph, id)];
    set((s) => ({ rippling: Array.from(new Set([...s.rippling, ...ids])) }));
    setTimeout(() => set((s) => ({ rippling: s.rippling.filter((r) => !ids.includes(r)) })), 950);
  },

  addEdge: (from, to, kind = "depends") => {
    if (from === to) return;
    set((s) => {
      if (s.graph.edges.some((e) => e.from === from && e.to === to)) return s;
      return { graph: { ...s.graph, edges: [...s.graph.edges, { id: genId("e"), from, to, kind }] } };
    });
  },

  removeEdge: (id) =>
    set((s) => ({ graph: { ...s.graph, edges: s.graph.edges.filter((e) => e.id !== id) } })),

  resetDemo: () =>
    set({ graph: seedGraph(), selectedId: null, mode: "explore", filterStatus: "all", rippling: [] }),
}));
