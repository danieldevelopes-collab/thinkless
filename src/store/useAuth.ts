import { create } from "zustand";
import type { User } from "../firebase/auth";
import { logout, registerEmail, signInEmail, signInWithGoogle, watchAuth } from "../firebase/auth";

type Status = "loading" | "in" | "out";

interface AuthState {
  user: User | null;
  status: Status;
  error: string | null;
  init: () => () => void;
  google: () => Promise<void>;
  email: (email: string, password: string, register: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

function friendly(e: unknown): string {
  const code = (e as { code?: string })?.code ?? "";
  const map: Record<string, string> = {
    "auth/invalid-credential": "Wrong email or password.",
    "auth/invalid-email": "That doesn't look like an email.",
    "auth/email-already-in-use": "That email already has an account — sign in instead.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/popup-closed-by-user": "Sign-in was cancelled.",
    "auth/popup-blocked": "Your browser blocked the popup — allow popups and retry.",
    "auth/operation-not-allowed": "This sign-in method isn't enabled in Firebase yet.",
    "auth/unauthorized-domain": "This domain isn't on the Firebase authorized list yet.",
  };
  return map[code] || (e as Error)?.message || "Something went wrong.";
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  status: "loading",
  error: null,
  init: () => watchAuth((user) => set({ user, status: user ? "in" : "out", error: null })),
  google: async () => {
    set({ error: null });
    try {
      await signInWithGoogle();
    } catch (e) {
      set({ error: friendly(e) });
    }
  },
  email: async (email, password, register) => {
    set({ error: null });
    try {
      if (register) await registerEmail(email, password);
      else await signInEmail(email, password);
    } catch (e) {
      set({ error: friendly(e) });
    }
  },
  signOut: async () => {
    await logout();
  },
  clearError: () => set({ error: null }),
}));
