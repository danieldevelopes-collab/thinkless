import { useEffect, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { Landing } from "./components/Landing";
import { Canvas } from "./components/Canvas";
import { Toolbar } from "./components/Toolbar";
import { NodeEditor } from "./components/NodeEditor";
import { FocusPanel } from "./components/FocusPanel";
import { SignInModal } from "./components/SignInModal";
import { useStore } from "./store/useStore";
import { useAuth } from "./store/useAuth";
import { useCloudSync } from "./hooks/useCloudSync";

export default function App() {
  const [view, setView] = useState<"landing" | "app">("landing");
  const [signInOpen, setSignInOpen] = useState(false);
  const initAuth = useAuth((s) => s.init);
  const status = useAuth((s) => s.status);

  // Subscribe to auth once; the returned unsubscribe is the effect cleanup.
  useEffect(() => initAuth(), [initAuth]);
  // Load/persist the signed-in user's workspace (no-op for guests).
  useCloudSync();

  // Signing in through the modal drops you straight into your workspace.
  useEffect(() => {
    if (status === "in" && signInOpen) {
      setSignInOpen(false);
      setView("app");
    }
  }, [status, signInOpen]);

  return (
    <>
      {view === "landing" ? (
        <Landing onLaunch={() => setView("app")} onSignIn={() => setSignInOpen(true)} />
      ) : (
        <Workspace onExit={() => setView("landing")} onSignIn={() => setSignInOpen(true)} />
      )}
      {signInOpen && <SignInModal onClose={() => setSignInOpen(false)} />}
    </>
  );
}

function Workspace({ onExit, onSignIn }: { onExit: () => void; onSignIn: () => void }) {
  const mode = useStore((s) => s.mode);
  const selectedId = useStore((s) => s.selectedId);
  return (
    <div className="space-bg relative h-screen w-screen overflow-hidden">
      <ReactFlowProvider>
        <div className="absolute inset-0">
          <Canvas />
        </div>
        <Toolbar onExit={onExit} onSignIn={onSignIn} />
        {mode === "focus" && <FocusPanel />}
        {selectedId && <NodeEditor />}
      </ReactFlowProvider>
    </div>
  );
}
