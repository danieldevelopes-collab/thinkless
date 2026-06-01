import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { SpatialNode as SNode } from "../types";
import { NODE_TYPE_META, PRIORITY_META, STATUS_META } from "../lib/nodeTypes";
import { ShapeIcon } from "./ShapeIcon";
import { relativeDue } from "../lib/format";
import { cx } from "../lib/cx";

export interface SpatialRenderData {
  node: SNode;
  onPath: boolean;
  pathIndex: number | null;
  rippling: boolean;
  dimmed: boolean;
  blocked: boolean;
  [key: string]: unknown;
}

export function SpatialNodeView({ data, selected }: NodeProps) {
  const d = data as unknown as SpatialRenderData;
  const n = d.node;
  const meta = NODE_TYPE_META[n.type];
  const accent = meta.color;
  const now = Date.now();
  const done = n.status === "done";
  const overdue = !!n.dueDate && !done && Date.parse(`${n.dueDate}T00:00:00Z`) < now;

  const ring = selected ? `0 0 0 2px ${accent}, ` : "";
  const shadow = d.onPath
    ? `0 10px 34px -12px ${accent}`
    : overdue
      ? "0 0 22px -6px rgba(255,122,144,0.7)"
      : "0 10px 26px -18px #000";

  const status = d.blocked && !done ? STATUS_META.blocked : STATUS_META[n.status];

  return (
    <div
      className={cx("relative w-[180px] rounded-2xl px-3 py-2.5 select-none", d.dimmed && "opacity-30")}
      style={{
        background: done ? "rgba(18,26,22,0.86)" : "rgba(15,19,30,0.88)",
        border: `1px solid ${d.onPath || selected ? accent : "rgba(255,255,255,0.10)"}`,
        boxShadow: ring + shadow,
        backdropFilter: "blur(6px)",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: accent }} />

      {d.rippling && (
        <span
          className="pointer-events-none absolute -inset-2 rounded-2xl animate-ripple"
          style={{ border: `2px solid ${accent}`, boxShadow: `0 0 26px ${accent}` }}
        />
      )}

      <div className="flex items-center gap-2">
        <span
          className="grid place-items-center rounded-lg"
          style={{ width: 22, height: 22, background: `${accent}22`, border: `1px solid ${accent}55` }}
        >
          <ShapeIcon shape={meta.shape} color={accent} size={13} />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: accent }}>
          {meta.label}
        </span>
        <span
          className="ml-auto h-2 w-2 rounded-full"
          style={{ background: PRIORITY_META[n.priority].color }}
          title={`${PRIORITY_META[n.priority].label} priority`}
        />
      </div>

      <div className={cx("mt-1.5 text-[13px] font-medium leading-snug text-slate-100", done && "line-through opacity-60")}>
        {n.title}
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[10px]">
        <span className="rounded-md px-1.5 py-0.5" style={{ background: `${status.color}22`, color: status.color }}>
          {status.label}
        </span>
        {n.dueDate && (
          <span
            className={cx("rounded-md px-1.5 py-0.5", overdue ? "bg-rose-500/20 text-rose-200" : "bg-white/5 text-slate-300")}
          >
            {relativeDue(n.dueDate, now)}
          </span>
        )}
        {d.onPath && d.pathIndex != null && (
          <span className="ml-auto rounded-md px-1.5 py-0.5 font-semibold" style={{ background: `${accent}22`, color: accent }}>
            {d.pathIndex === 0 ? "Start" : `#${d.pathIndex + 1}`}
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Right} style={{ background: accent }} />
    </div>
  );
}
