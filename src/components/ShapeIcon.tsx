import type { TypeShape } from "../lib/nodeTypes";

/** A small stroked SVG glyph whose form is distinct per node type. */
export function ShapeIcon({ shape, color, size = 14 }: { shape: TypeShape; color: string; size?: number }) {
  const p = { fill: "none", stroke: color, strokeWidth: 1.8, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {shape === "rect" && <rect x="4" y="6" width="16" height="12" rx="3" {...p} />}
      {shape === "hex" && <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" {...p} />}
      {shape === "circle" && <circle cx="12" cy="12" r="8" {...p} />}
      {shape === "diamond" && <polygon points="12,3 21,12 12,21 3,12" {...p} />}
      {shape === "spark" && <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" {...p} />}
      {shape === "split" && <path d="M6 20 L6 12 Q6 8 10 8 L18 8 M14 4 L18 8 L14 12" {...p} />}
      {shape === "triangle" && <polygon points="12,3 21,20 3,20" {...p} />}
      {shape === "pill" && (
        <>
          <circle cx="12" cy="8" r="3.4" {...p} />
          <path d="M5 20 Q5 13 12 13 Q19 13 19 20" {...p} />
        </>
      )}
    </svg>
  );
}
