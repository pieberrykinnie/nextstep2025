// extension/content/inject.tsx
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Caption } from "../ui/Caption";

const ROOT_ID = "limitlessmeet-root";

function ensureRoot() {
  if (document.getElementById(ROOT_ID)) return;
  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.style.all = "initial";
  root.style.position = "fixed";
  root.style.bottom = "4%";
  root.style.left = "50%";
  root.style.transform = "translateX(-50%)";
  root.style.zIndex = "2147483647"; // top-most
  document.documentElement.appendChild(root);
}

ensureRoot();

const mountNode = document.getElementById(ROOT_ID)!;

function RootApp() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    // Listen for transcripts from background
    const handler = (msg: any) => {
      if (msg.transcript) {
        setLines((prev) => [...prev, msg.transcript]);
      }
    };
    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }, []);

  return <Caption lines={lines} fontSizePx={18} />;
}

createRoot(mountNode).render(<RootApp />);

chrome.runtime.sendMessage({ ping: "hello" });