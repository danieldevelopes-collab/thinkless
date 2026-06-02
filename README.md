# Thinkless

**A spatial productivity system — your project becomes a navigable map, and a deterministic _Momentum Path_ shows the best next route through the work.**

Not a board, list, or calendar. Goals, tasks, blockers, milestones and decisions live as connected nodes on a zoomable canvas. Completing work sends a ripple through the graph, and the app continuously computes *where to go next* — no AI, no backend cost, just a graph algorithm running client-side.

> **Status:** Phases 1–2 complete — the full interactive layer **plus** Google/email sign-in and one-document Firestore persistence. **Live: [danieldevelopes-thinkless.web.app](https://danieldevelopes-thinkless.web.app)** (guest mode needs no sign-in). Phases 3–4 add zones, export, and collaboration (see [Roadmap](#roadmap)).

By **Daniel Bracher** · TypeScript · React + Vite · React Flow · Tailwind · Zustand · Vitest · MIT.

---

## The differentiator: the Momentum Path

Most tools show **what exists**. Thinkless computes **where to go next**, deterministically:

1. Dependency links form a DAG (`A → B` means *A must be done before B*). Cycles are detected and flagged.
2. The **actionable frontier** = incomplete, un-blocked nodes whose every prerequisite is done.
3. Each is scored: `priority × 1.0 + deadlinePressure × 1.2 + leverage × 0.8`, where *leverage* = how many downstream nodes it unblocks and *pressure* rises as a due date nears (and exceeds 1 when overdue).
4. The **path** is a greedy simulation: take the top-scored node, mark it done, recompute the frontier, repeat — yielding *"start here → then this → which unlocks that."*

All of this is pure, dependency-free logic in [`src/lib/`](src/lib/) with full unit tests — the engine is correct before any pixel is drawn.

```bash
npm test     # 14 tests over graph + momentum logic
```

## Features (Phase 1)

- **Spatial canvas** — pan/zoom, drag, connect; minimap + controls.
- **8 node types**, each with a distinct shape, colour and icon: Task, Goal, Milestone, Blocker, Idea, Decision, Risk, Person.
- **Directed dependency graph** (`depends`) + non-blocking `relates` links.
- **Momentum Path** highlighted on the canvas and listed, with reasons, in **Focus mode** (which dims everything off-path).
- **Completion waves** — finishing a node ripples to its dependents.
- **Deadline pressure** — overdue / near-due nodes glow.
- **Blocked detection** — anything waiting on incomplete work is surfaced.
- **Node editor** — edit every field and manage links from a glass side panel.
- **Status filter**, **seeded guest demo** (no sign-in), responsive dark "spatial" UI.

## Sign-in & cloud sync (Phase 2)

- **Sign in with Google or email/password** — or stay in **guest mode**, which needs no account and touches no backend.
- **Your workspace persists** as a single Firestore document: load = **1 read**, debounced save = **1 write**, with an **offline cache** so it works without a connection.
- **Owner-only security rules** — `workspaces/{uid}` is readable and writable only by that signed-in user.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to dist/
npm test           # engine unit tests
```

## Architecture

```
src/
  types.ts            domain model (nodes, edges, graph)
  lib/
    graph.ts          DAG: prerequisites, dependents, descendants, cycle detection
    momentum.ts       scoring, actionable frontier, the Momentum Path, blocked nodes
    format.ts         deterministic date math (pure; tests pass `now`)
    seed.ts           the curated guest-demo workspace
    *.test.ts         Vitest suites for the logic above
  store/useStore.ts   Zustand store — the single source of truth for the graph + UI
  components/         Canvas (React Flow), SpatialNode, NodeEditor, FocusPanel, Toolbar, Landing
```

**Why these choices:** the domain graph is the single source of truth (Zustand); React Flow renders it. The *logic* (the interesting, fail-able part) is pure and tested in isolation, exactly like the Firestore engine will be. The UI is a thin, replaceable shell over it.

## Spark-safety (Phase 2 design)

This app is built to run on Firebase's **free Spark plan**. The persistence model is chosen to be read-light and write-light:

- **One document per workspace** holds the whole graph → load = **1 read**, save = **1 debounced write** (not one doc per node, which would cost N reads per open).
- Optimistic local state; Firestore is persistence, not the live wire.
- Offline persistent cache; security rules restrict each workspace to its owner.
- Guest demo uses **local state only** → zero Firestore usage for visitors.

## A short history of thinking in space

Thinkless stands on two old ideas — *think in space* and *follow the critical path* — and it's worth naming where they came from.

**Seeing your thoughts laid out.** In **1945**, **Vannevar Bush** described the **Memex** in *As We May Think*: a desk that stored documents and, crucially, let you build **associative trails** between them, because he believed the mind works by association, not by index. Two decades later **Ted Nelson** coined **"hypertext"** (**1965**) and chased it through **Project Xanadu**; in **1968**, **Douglas Engelbart**'s **NLS** — the demo now called *"The Mother of All Demos"* — showed linked, structured, navigable information (and the mouse) for the first time. **Tony Buzan** popularised the hand-drawn **mind map** in the 1970s. Researchers **Catherine Marshall** and **Frank Shipman** then studied **spatial hypertext** — the finding that people encode meaning in *where* they place things — and **Mark Bernstein**'s **Tinderbox** turned it into a tool. The modern descendants are everywhere: **Miro**, **Milanote**, **Obsidian**'s graph view, **Roam Research**'s networked thought.

**Knowing what to do next.** The other half is older than the computer's spatial dreams. In **1957–58**, two methods for scheduling huge projects appeared almost simultaneously: the **Critical Path Method (CPM)** — by **James Kelley** (Remington Rand) and **Morgan Walker** (DuPont) — and **PERT**, built for the US Navy's Polaris programme. Both model work as a **graph of dependencies** and compute the **critical path**: the chain that decides the soonest you can possibly finish. **David Allen**'s *Getting Things Done* (**2001**) distilled the human version into two words — **"next action."** Thinkless's **Momentum Path is a small, direct descendant of CPM**: a dependency graph, scored and walked to surface the highest-leverage next step.

Most tools inherited the **map** but not the **math**. Thinkless tries to carry both.

> These attributions are offered in good faith; if a name, date, or credit is off, corrections are genuinely welcome.

## The language it's built in

Thinkless runs in the browser, so it's built in the browser's language — and that language has a remarkable origin. **JavaScript** was written by **Brendan Eich** at **Netscape** in **1995**, famously in about **ten days**, to make web pages move. For years it was dismissed as a toy; today it is the most widely deployed language on Earth, running in every browser on the planet — which is exactly why a Thinkless workspace needs no install and opens anywhere.

But raw JavaScript has no type system, and a graph engine full of scoring and dependency math is precisely the kind of code that rots without one. So Thinkless is written in **TypeScript** — created by **Anders Hejlsberg** at **Microsoft** in **2012** (the same architect behind Turbo Pascal, Delphi and C#). TypeScript layers static types over JavaScript, catching whole classes of mistakes before the code ever runs, then compiling away to ordinary JavaScript. The Momentum Path engine is fully typed and unit-tested — the types are part of why its arithmetic can be trusted.

## Credits & acknowledgements

Built on a lot of other people's work: **React** & **React Flow** (`@xyflow/react`, xyflow team) for the canvas, **Zustand** (Poimandres) for state, **Tailwind CSS**, **Vite**, **Vitest**, and **Firebase** (Auth, Firestore, Hosting) for the free-tier backend. The ideas above belong to the pioneers named in the history.

## Roadmap

- **Phase 1 — done:** the interactive layer over mock data.
- **Phase 2 — done:** Firebase Auth (Google + email), one-doc Firestore persistence, offline cache, owner-only security rules.
- **Phase 3:** zones/rooms, activity timeline, saved views, multi-workspace, export (JSON/PNG).
- **Phase 4:** real-time multi-user presence & sharing, themes, optional 3D zone view.

## License

[MIT](LICENSE) © 2026 Daniel Bracher.
