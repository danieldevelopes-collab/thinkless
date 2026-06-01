import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { Landing } from "./components/Landing";
import { Canvas } from "./components/Canvas";
import { Toolbar } from "./components/Toolbar";
import { NodeEditor } from "./components/NodeEditor";
import { FocusPanel } from "./components/FocusPanel";
import { useStore } from "./store/useStore";

export default function App() {
  const [view, setView] = useState<"landing" | "app">("landing");
  if (view === "landing") return <Landing onLaunch={() => setView("app")} />;
  return <Workspace onExit={() => setView("landing")} />;
}

function Workspace({ onExit }: { onExit: () => void }) {
  const mode = useStore((s) => s.mode);
  const selectedId = useStore((s) => s.selectedId);
  return (
    <div className="space-bg relative h-screen w-screen overflow-hidden">
      <ReactFlowProvider>
        <div className="absolute inset-0">
          <Canvas />
        </div>
        <Toolbar onExit={onExit} />
        {mode === "focus" && <FocusPanel />}
        {selectedId && <NodeEditor />}
      </ReactFlowProvider>
    </div>
  );
}
