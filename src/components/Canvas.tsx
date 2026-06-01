import { useCallback, useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type NodeTypes,
} from "@xyflow/react";
import { useStore } from "../store/useStore";
import { SpatialNodeView, type SpatialRenderData } from "./SpatialNode";
import { blockedNodes, momentumPath } from "../lib/momentum";
import { NODE_TYPE_META } from "../lib/nodeTypes";

const nodeTypes: NodeTypes = { spatial: SpatialNodeView };

export function Canvas() {
  const graph = useStore((s) => s.graph);
  const selectedId = useStore((s) => s.selectedId);
  const mode = useStore((s) => s.mode);
  const filterStatus = useStore((s) => s.filterStatus);
  const rippling = useStore((s) => s.rippling);
  const moveNode = useStore((s) => s.moveNode);
  const addEdge = useStore((s) => s.addEdge);
  const setSelected = useStore((s) => s.setSelected);

  // `now` is stable for the session so the path doesn't jitter every render.
  const now = useMemo(() => Date.now(), []);

  const path = useMemo(() => momentumPath(graph, now), [graph, now]);
  const pathIndex = useMemo(() => new Map(path.map((n, i) => [n.id, i])), [path]);
  const blockedSet = useMemo(() => new Set(blockedNodes(graph).map((n) => n.id)), [graph]);

  const dimmedSet = useMemo(() => {
    const s = new Set<string>();
    if (mode === "focus") {
      for (const n of graph.nodes) if (!pathIndex.has(n.id)) s.add(n.id);
    } else if (filterStatus !== "all") {
      for (const n of graph.nodes) {
        const match = filterStatus === "blocked" ? blockedSet.has(n.id) : n.status === filterStatus;
        if (!match) s.add(n.id);
      }
    }
    return s;
  }, [graph.nodes, mode, filterStatus, pathIndex, blockedSet]);

  const nodes = useMemo<Node[]>(
    () =>
      graph.nodes.map((n) => {
        const data: SpatialRenderData = {
          node: n,
          onPath: pathIndex.has(n.id),
          pathIndex: pathIndex.get(n.id) ?? null,
          rippling: rippling.includes(n.id),
          dimmed: dimmedSet.has(n.id),
          blocked: blockedSet.has(n.id),
        };
        return {
          id: n.id,
          type: "spatial",
          position: { x: n.x, y: n.y },
          selected: selectedId === n.id,
          data,
        };
      }),
    [graph.nodes, pathIndex, rippling, dimmedSet, blockedSet, selectedId]
  );

  const edges = useMemo<Edge[]>(
    () =>
      graph.edges.map((e) => {
        const onPath = pathIndex.has(e.from) && pathIndex.has(e.to);
        const depends = e.kind === "depends";
        const stroke = onPath ? "#6ea8fe" : depends ? "rgba(150,170,210,0.45)" : "rgba(120,130,150,0.3)";
        return {
          id: e.id,
          source: e.from,
          target: e.to,
          animated: onPath,
          style: { stroke, strokeDasharray: depends ? undefined : "5 5" },
          markerEnd: { type: MarkerType.ArrowClosed, color: stroke, width: 16, height: 16 },
        };
      }),
    [graph.edges, pathIndex]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      for (const c of changes) {
        if (c.type === "position" && c.position) {
          moveNode(c.id, Math.round(c.position.x), Math.round(c.position.y));
        }
      }
    },
    [moveNode]
  );

  const onConnect = useCallback(
    (c: Connection) => {
      if (c.source && c.target) addEdge(c.source, c.target, "depends");
    },
    [addEdge]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onConnect={onConnect}
      onNodeClick={(_, n) => setSelected(n.id)}
      onPaneClick={() => setSelected(null)}
      deleteKeyCode={null}
      fitView
      minZoom={0.2}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="rgba(255,255,255,0.06)" />
      <MiniMap
        pannable
        zoomable
        maskColor="rgba(7,10,18,0.7)"
        nodeColor={(nd) => {
          const d = nd.data as unknown as SpatialRenderData;
          return NODE_TYPE_META[d.node.type].color;
        }}
      />
      <Controls />
    </ReactFlow>
  );
}
