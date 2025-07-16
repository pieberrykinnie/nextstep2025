// extension/content/inject.tsx
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Caption } from "../ui/Caption";
import { SummaryPanel } from "../ui/SummaryPanel";

const ROOT_ID = "limitlessmeet-root";

function ensureRoot() {
  if (document.getElementById(ROOT_ID)) return;
  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.style.all = "initial";
  document.documentElement.appendChild(root);
}

ensureRoot();

const mountNode = document.getElementById(ROOT_ID)!;

function RootApp() {
  const [lines, setLines] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [actions, setActions] = useState<string[]>([]);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);

  useEffect(() => {
    const handler = (msg: any) => {
      if (msg.transcript) {
        setLines((prev) => [...prev, msg.transcript]);
      }
      if (msg.summary) {
        setSummary(msg.summary);
        setActions(msg.actions || []);
      }
    };
    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }, []);

  // keyboard shortcut Ctrl+Alt+C to toggle captions
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyC" && e.ctrlKey && e.altKey) {
        setShowCaptions((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {showCaptions && <Caption lines={lines} fontSizePx={18} />}
      <SummaryPanel summary={summary} actions={actions} />
    </>
  );
}

createRoot(mountNode).render(<RootApp />);

chrome.runtime.sendMessage({ ping: "hello" });