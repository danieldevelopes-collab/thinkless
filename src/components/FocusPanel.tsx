import { useMemo } from "react";
import { useReactFlow } from "@xyflow/react";
import { useStore } from "../store/useStore";
import { blockedNodes, frontier, momentumPath } from "../lib/momentum";
import { NODE_TYPE_META } from "../lib/nodeTypes";

export function FocusPanel() {
  const graph = useStore((s) => s.graph);
  const setSelected = useStore((s) => s.setSelected);
  const rf = useReactFlow();

  const now = useMemo(() => Date.now(), []);
  const path = useMemo(() => momentumPath(graph, now), [graph, now]);
  const front = useMemo(() => frontier(graph, now), [graph, now]);
  const blocked = useMemo(() => blockedNodes(graph), [graph]);
  const topReasons = front[0]?.reasons ?? [];

  const focus = (id: string) => {
    setSelected(id);
    const n = graph.nodes.find((x) => x.id === id);
    if (n) rf.setCenter(n.x + 90, n.y + 44, { zoom: 1.15, duration: 500 });
  };

  return (
    <aside className="glass absolute left-3 top-[68px] bottom-3 z-20 flex w-[300px] flex-col overflow-y-auto rounded-2xl p-4">
      <h2 className="text-sm font-semibold text-white">Momentum Path</h2>
      <p className="mt-1 text-xs leading-relaxed text-slate-400">
        Your best next route — from priority, deadlines, and what each task unblocks. No AI; just the graph.
      </p>

      {path.length === 0 && (
        <p className="mt-4 text-sm text-slate-400">Nothing actionable right now. Clear a blocker to open the path.</p>
      )}

      <ol className="mt-3 space-y-2">
        {path.map((n, i) => {
          const meta = NODE_TYPE_META[n.type];
          return (
            <li key={n.id}>
              <button
                onClick={() => focus(n.id)}
                className="flex w-full items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-2 text-left transition hover:border-accent/50"
              >
                <span
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[11px] font-bold"
                  style={{ background: `${meta.color}22`, color: meta.color }}
                >
                  {i === 0 ? "▶" : i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm text-slate-100">{n.title}</span>
                  <span className="text-[11px]" style={{ color: meta.color }}>
                    {i === 0 ? "Start here" : "then"}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {topReasons.length > 0 && (
        <div className="mt-3 rounded-xl border border-accent/20 bg-accent/5 p-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Why start here</div>
          <ul className="mt-1 space-y-0.5 text-xs text-slate-300">
            {topReasons.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
        </div>
      )}

      <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">Blocked ({blocked.length})</h3>
      <ul className="mt-2 space-y-1">
        {blocked.map((n) => (
          <li key={n.id}>
            <button
              onClick={() => focus(n.id)}
              className="flex w-full items-center gap-2 rounded-lg bg-white/5 px-2 py-1.5 text-left text-sm text-slate-300 hover:text-white"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-rose-400" />
              <span className="truncate">{n.title}</span>
            </button>
          </li>
        ))}
        {blocked.length === 0 && <li className="text-xs text-slate-500">No blockers. Clear sailing.</li>}
      </ul>
    </aside>
  );
}
