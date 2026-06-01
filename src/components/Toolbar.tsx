import { useState } from "react";
import { useStore } from "../store/useStore";
import { NODE_TYPE_META, NODE_TYPE_ORDER, STATUS_META } from "../lib/nodeTypes";
import { ShapeIcon } from "./ShapeIcon";
import type { Status } from "../types";
import { useAuth } from "../store/useAuth";

export function Toolbar({ onExit, onSignIn }: { onExit: () => void; onSignIn: () => void }) {
  const addNode = useStore((s) => s.addNode);
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const filter = useStore((s) => s.filterStatus);
  const setFilter = useStore((s) => s.setFilter);
  const reset = useStore((s) => s.resetDemo);
  const count = useStore((s) => s.graph.nodes.length);
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute left-3 right-3 top-3 z-30 flex items-center gap-2">
      <div className="glass flex items-center gap-2 rounded-2xl px-3 py-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-violet text-sm font-black text-space-900">
          T
        </span>
        <span className="text-sm font-semibold text-white">Thinkless</span>
        <span className="ml-1 rounded-md bg-white/5 px-1.5 py-0.5 text-[10px]" style={{ color: user ? "#39d98a" : "#97a3b6" }}>
          {user ? "☁ synced" : "guest demo"}
        </span>
      </div>

      <div className="glass relative flex items-center gap-1 rounded-2xl px-2 py-1.5">
        <button onClick={() => setOpen((o) => !o)} className="rounded-lg px-2.5 py-1.5 text-sm text-slate-100 hover:bg-white/10">
          + Add node
        </button>
        {open && (
          <div className="absolute left-0 top-[calc(100%+6px)] z-40 grid w-44 gap-0.5 rounded-xl border border-white/10 bg-space-800/95 p-1 backdrop-blur">
            {NODE_TYPE_ORDER.map((t) => {
              const m = NODE_TYPE_META[t];
              return (
                <button
                  key={t}
                  onClick={() => {
                    addNode(t);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-slate-200 hover:bg-white/10"
                >
                  <ShapeIcon shape={m.shape} color={m.color} size={14} /> {m.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="mx-1 h-5 w-px bg-white/10" />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as Status | "all")}
          className="rounded-lg bg-transparent px-1.5 py-1.5 text-sm text-slate-200 outline-none"
        >
          <option value="all">All statuses</option>
          {(Object.keys(STATUS_META) as Status[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>

        <div className="mx-1 h-5 w-px bg-white/10" />

        <button
          onClick={() => setMode(mode === "focus" ? "explore" : "focus")}
          className={`rounded-lg px-2.5 py-1.5 text-sm ${mode === "focus" ? "bg-accent/20 text-accent" : "text-slate-200 hover:bg-white/10"}`}
        >
          ◎ Focus
        </button>
      </div>

      <div className="glass ml-auto flex items-center gap-1 rounded-2xl px-2 py-1.5">
        <span className="px-2 text-xs text-slate-400">{count} nodes</span>
        <button onClick={reset} className="rounded-lg px-2.5 py-1.5 text-sm text-slate-300 hover:bg-white/10" title="Reset workspace">
          ↻ Reset
        </button>
        {user ? (
          <>
            <span className="max-w-[150px] truncate px-2 text-xs text-slate-300" title={user.email ?? undefined}>
              {user.email ?? "Signed in"}
            </span>
            <button onClick={() => signOut()} className="rounded-lg px-2.5 py-1.5 text-sm text-slate-300 hover:bg-white/10">
              Sign out
            </button>
          </>
        ) : (
          <button onClick={onSignIn} className="rounded-lg bg-accent/20 px-2.5 py-1.5 text-sm font-medium text-accent hover:bg-accent/30">
            Sign in
          </button>
        )}
        <button onClick={onExit} className="rounded-lg px-2.5 py-1.5 text-sm text-slate-300 hover:bg-white/10">
          Exit
        </button>
      </div>
    </header>
  );
}
