import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./config";
import type { Graph } from "../types";

// One document per user holds the entire workspace graph: load = 1 read,
// save = 1 write. Keyed by uid so security rules are a one-liner.
const ref = (uid: string) => doc(db, "workspaces", uid);

export async function loadWorkspace(uid: string): Promise<Graph | null> {
  const snap = await getDoc(ref(uid));
  if (!snap.exists()) return null;
  const g = snap.data().graph as Graph | undefined;
  if (!g || !Array.isArray(g.nodes) || !Array.isArray(g.edges)) return null;
  return g;
}

export async function saveWorkspace(uid: string, graph: Graph): Promise<void> {
  await setDoc(ref(uid), { graph, updatedAt: serverTimestamp() }, { merge: true });
}
