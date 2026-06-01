import { useEffect, useRef } from "react";
import { useAuth } from "../store/useAuth";
import { useStore } from "../store/useStore";
import { loadWorkspace, saveWorkspace } from "../firebase/workspace";
import { seedGraph } from "../lib/seed";

/**
 * Bridges auth state and the graph store. When a user is signed in, their
 * workspace is the single Firestore doc workspaces/{uid}:
 *   - on sign-in we load it once (1 read), seeding a fresh one on first visit;
 *   - graph changes are debounced and saved (1 write, ~1.5s after they stop).
 * Guest users never touch Firestore — the seed graph stays purely local.
 */
export function useCloudSync() {
  const user = useAuth((s) => s.user);
  const status = useAuth((s) => s.status);
  const replaceGraph = useStore((s) => s.replaceGraph);

  const uidRef = useRef<string | null>(null);
  const suppress = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load the workspace whenever the signed-in user changes.
  useEffect(() => {
    if (status !== "in" || !user) {
      uidRef.current = null;
      return;
    }
    let cancelled = false;
    uidRef.current = user.uid;
    suppress.current = true; // don't echo the freshly-loaded graph back as a write
    (async () => {
      let g = await loadWorkspace(user.uid);
      if (cancelled) return;
      if (!g) {
        g = seedGraph();
        await saveWorkspace(user.uid, g);
      }
      replaceGraph(g);
      setTimeout(() => {
        suppress.current = false;
      }, 400);
    })();
    return () => {
      cancelled = true;
    };
  }, [status, user, replaceGraph]);

  // Debounced save on graph changes (only while signed in).
  useEffect(() => {
    const unsub = useStore.subscribe((state, prev) => {
      if (state.graph === prev.graph) return;
      const uid = uidRef.current;
      if (!uid || suppress.current) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        void saveWorkspace(uid, useStore.getState().graph).catch(() => {});
      }, 1500);
    });
    return () => {
      unsub();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
}
