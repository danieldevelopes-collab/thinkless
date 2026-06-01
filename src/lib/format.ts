/** Date helpers. Pure functions take `now` (ms) so they're deterministic in tests. */

const DAY = 86_400_000;

export function daysUntil(dueDate: string | null | undefined, now: number): number | null {
  if (!dueDate) return null;
  const due = Date.parse(`${dueDate}T00:00:00Z`);
  if (Number.isNaN(due)) return null;
  return Math.floor((due - now) / DAY);
}

export function formatDue(dueDate?: string | null): string {
  if (!dueDate) return "No due date";
  const d = new Date(`${dueDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "No due date";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function relativeDue(dueDate: string | null | undefined, now: number): string {
  const d = daysUntil(dueDate, now);
  if (d === null) return "";
  if (d < 0) return `${-d}d overdue`;
  if (d === 0) return "due today";
  if (d === 1) return "due tomorrow";
  if (d <= 7) return `in ${d}d`;
  return `in ${Math.round(d / 7)}w`;
}
