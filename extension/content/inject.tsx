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

  return (
    <>
      <Caption lines={lines} fontSizePx={18} />
      <SummaryPanel summary={summary} actions={actions} />
    </>
  );
}

createRoot(mountNode).render(<RootApp />);

chrome.runtime.sendMessage({ ping: "hello" });