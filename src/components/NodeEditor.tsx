import { useStore } from "../store/useStore";
import { NODE_TYPE_META, NODE_TYPE_ORDER, PRIORITY_META, STATUS_META } from "../lib/nodeTypes";
import type { NodeType, Priority, Status } from "../types";
import { ShapeIcon } from "./ShapeIcon";

const FIELD = "w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-slate-100 outline-none focus:border-accent/60";

export function NodeEditor() {
  const selectedId = useStore((s) => s.selectedId);
  const graph = useStore((s) => s.graph);
  const update = useStore((s) => s.updateNode);
  const del = useStore((s) => s.deleteNode);
  const complete = useStore((s) => s.completeNode);
  const removeEdge = useStore((s) => s.removeEdge);
  const setSelected = useStore((s) => s.setSelected);

  const node = graph.nodes.find((n) => n.id === selectedId) ?? null;
  if (!node) return null;

  const meta = NODE_TYPE_META[node.type];
  const titleOf = (id: string) => graph.nodes.find((n) => n.id === id)?.title ?? id;
  const prereqs = graph.edges.filter((e) => e.kind === "depends" && e.to === node.id);
  const blocks = graph.edges.filter((e) => e.kind === "depends" && e.from === node.id);

  return (
    <aside className="glass absolute right-3 top-[68px] bottom-3 z-20 flex w-[320px] flex-col overflow-y-auto rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: `${meta.color}22`, border: `1px solid ${meta.color}55` }}>
          <ShapeIcon shape={meta.shape} color={meta.color} size={15} />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: meta.color }}>{meta.label}</span>
        <button onClick={() => setSelected(null)} className="ml-auto rounded-md px-2 py-1 text-slate-400 hover:bg-white/5 hover:text-slate-200">✕</button>
      </div>

      <input
        className={`${FIELD} mt-3 text-base font-medium`}
        value={node.title}
        onChange={(e) => update(node.id, { title: e.target.value })}
        placeholder="Untitled"
      />

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Field label="Type">
          <select className={FIELD} value={node.type} onChange={(e) => update(node.id, { type: e.target.value as NodeType })}>
            {NODE_TYPE_ORDER.map((t) => <option key={t} value={t}>{NODE_TYPE_META[t].label}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select className={FIELD} value={node.status} onChange={(e) => update(node.id, { status: e.target.value as Status })}>
            {(Object.keys(STATUS_META) as Status[]).map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
          </select>
        </Field>
        <Field label="Priority">
          <select className={FIELD} value={node.priority} onChange={(e) => update(node.id, { priority: e.target.value as Priority })}>
            {(Object.keys(PRIORITY_META) as Priority[]).map((p) => <option key={p} value={p}>{PRIORITY_META[p].label}</option>)}
          </select>
        </Field>
        <Field label="Due date">
          <input type="date" className={FIELD} value={node.dueDate ?? ""} onChange={(e) => update(node.id, { dueDate: e.target.value || null })} />
        </Field>
      </div>

      <Field label="Tags" className="mt-3">
        <input
          className={FIELD}
          value={node.tags.join(", ")}
          onChange={(e) => update(node.id, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
          placeholder="comma, separated"
        />
      </Field>

      <Field label="Notes" className="mt-3">
        <textarea className={`${FIELD} h-20 resize-none`} value={node.notes ?? ""} onChange={(e) => update(node.id, { notes: e.target.value })} placeholder="Add detail…" />
      </Field>

      <div className="mt-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Depends on ({prereqs.length})</div>
        {prereqs.length === 0 && <p className="mt-1 text-xs text-slate-500">Drag from another node's right handle into this one.</p>}
        {prereqs.map((e) => (
          <LinkRow key={e.id} label={titleOf(e.from)} onRemove={() => removeEdge(e.id)} onOpen={() => setSelected(e.from)} />
        ))}
      </div>

      <div className="mt-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Unblocks ({blocks.length})</div>
        {blocks.map((e) => (
          <LinkRow key={e.id} label={titleOf(e.to)} onRemove={() => removeEdge(e.id)} onOpen={() => setSelected(e.to)} />
        ))}
      </div>

      <div className="mt-auto flex gap-2 pt-4">
        {node.status !== "done" && (
          <button onClick={() => complete(node.id)} className="flex-1 rounded-lg bg-accent-green/20 px-3 py-2 text-sm font-semibold text-accent-green hover:bg-accent-green/30">
            ✓ Mark complete
          </button>
        )}
        <button onClick={() => del(node.id)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10">Delete</button>
      </div>
    </aside>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function LinkRow({ label, onRemove, onOpen }: { label: string; onRemove: () => void; onOpen: () => void }) {
  return (
    <div className="mt-1 flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1.5 text-sm">
      <button onClick={onOpen} className="truncate text-left text-slate-200 hover:text-white">{label}</button>
      <button onClick={onRemove} className="ml-auto text-slate-500 hover:text-rose-300" title="Remove link">✕</button>
    </div>
  );
}
