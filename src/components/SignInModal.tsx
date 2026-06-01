import { useState, type FormEvent } from "react";
import { useAuth } from "../store/useAuth";

const FIELD =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent/60";

export function SignInModal({ onClose }: { onClose: () => void }) {
  const google = useAuth((s) => s.google);
  const email = useAuth((s) => s.email);
  const error = useAuth((s) => s.error);
  const clearError = useAuth((s) => s.clearError);

  const [mode, setMode] = useState<"in" | "register">("in");
  const [mail, setMail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await email(mail, pw, mode === "register");
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="glass w-[360px] rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{mode === "in" ? "Sign in" : "Create account"}</h2>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-slate-400 hover:bg-white/5">✕</button>
        </div>
        <p className="mt-1 text-sm text-slate-400">Save your workspace to the cloud and pick it up on any device.</p>

        <button
          onClick={() => google()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          <GoogleGlyph /> Continue with Google
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-slate-500">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={submit} className="space-y-2">
          <input type="email" required placeholder="you@email.com" autoComplete="email" value={mail}
            onChange={(e) => { setMail(e.target.value); clearError(); }} className={FIELD} />
          <input type="password" required placeholder="password" autoComplete={mode === "in" ? "current-password" : "new-password"} value={pw}
            onChange={(e) => { setPw(e.target.value); clearError(); }} className={FIELD} />
          {error && <p className="text-xs text-rose-300">{error}</p>}
          <button type="submit" disabled={busy}
            className="w-full rounded-lg bg-gradient-to-br from-accent to-accent-violet px-4 py-2.5 text-sm font-semibold text-space-900 transition hover:brightness-110 disabled:opacity-60">
            {busy ? "…" : mode === "in" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === "in" ? "register" : "in"); clearError(); }}
          className="mt-3 w-full text-center text-xs text-slate-400 hover:text-slate-200"
        >
          {mode === "in" ? "New here? Create an account" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
