import { NODE_TYPE_META, NODE_TYPE_ORDER } from "../lib/nodeTypes";
import { ShapeIcon } from "./ShapeIcon";

const FEATURES: { title: string; body: string }[] = [
  { title: "Spatial canvas", body: "Pan and zoom a living map of your work instead of scrolling rows." },
  { title: "Dependency graph", body: "Connect nodes so the app knows what blocks what." },
  { title: "Momentum Path", body: "A deterministic next-best route — priority × deadline × leverage." },
  { title: "Completion waves", body: "Finishing a node ripples outward and unblocks the chain." },
  { title: "Focus mode", body: "Hide the noise; see only the path and what's blocking it." },
  { title: "Deadline pressure", body: "Overdue and near-due work glows so nothing slips silently." },
  { title: "Firebase-ready", body: "Designed read-light & write-light for the free Spark plan." },
  { title: "Keyboard-first", body: "Built to be driven fast, like Linear — not clicked through." },
];

export function Landing({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="space-bg min-h-screen text-slate-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-violet text-sm font-black text-space-900">SW</span>
          <span className="font-semibold">Thinkless</span>
        </div>
        <button onClick={onLaunch} className="rounded-full border border-white/15 px-4 py-1.5 text-sm hover:border-accent/60">
          Launch demo
        </button>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-10 pt-12 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-glow" /> Spatial productivity · runs on Firebase Spark
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl bg-gradient-to-b from-white to-slate-400 bg-clip-text text-5xl font-extrabold leading-[1.05] tracking-tight text-transparent sm:text-6xl">
          Your project becomes a map.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
          Thinkless turns goals, tasks, blockers and decisions into a living spatial graph — then computes the
          <span className="text-slate-200"> best next route</span> through the work. Most tools show what exists; this shows where to go next.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button onClick={onLaunch} className="rounded-full bg-gradient-to-br from-accent to-accent-violet px-6 py-3 font-semibold text-space-900 shadow-lg shadow-accent/20 transition hover:brightness-110">
            Launch the live demo →
          </button>
          <a href="https://github.com/danieldevelopes-collab" className="rounded-full border border-white/15 px-6 py-3 text-sm text-slate-200 hover:border-white/30">
            View source
          </a>
        </div>
        <p className="mt-3 text-xs text-slate-500">No sign-up — the demo runs entirely in your browser.</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {NODE_TYPE_ORDER.map((t) => {
            const m = NODE_TYPE_META[t];
            return (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs" style={{ color: m.color }}>
                <ShapeIcon shape={m.shape} color={m.color} size={12} /> {m.label}
              </span>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "1", t: "Map your work", b: "Drop goals, tasks, blockers, ideas and decisions onto an infinite canvas. Each type has its own shape and colour." },
            { n: "2", t: "Connect dependencies", b: "Draw links so the app understands order: what must happen before what, and what each task unblocks." },
            { n: "3", t: "Follow the momentum", b: "Thinkless highlights the highest-leverage next step and the chain it unlocks — your path through the chaos." },
          ].map((c) => (
            <div key={c.n} className="glass rounded-2xl p-5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 font-bold text-accent">{c.n}</div>
              <h3 className="mt-3 font-semibold text-white">{c.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-center text-2xl font-bold text-white">Everything in the box</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-sm font-semibold text-white">{f.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{f.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button onClick={onLaunch} className="rounded-full bg-gradient-to-br from-accent to-accent-violet px-6 py-3 font-semibold text-space-900 transition hover:brightness-110">
            Open the canvas →
          </button>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        Thinkless · Daniel Bracher · a Firebase Spark-safe spatial productivity system.
      </footer>
    </div>
  );
}
