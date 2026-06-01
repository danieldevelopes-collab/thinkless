let counter = 0;

/** Short unique-enough id for client-side nodes/edges. */
export function genId(prefix = "n"): string {
  counter += 1;
  const t = Date.now().toString(36).slice(-4);
  return `${prefix}_${t}${counter}`;
}
