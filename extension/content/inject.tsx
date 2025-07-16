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

  // Demo: push dummy caption every 3s until ASR integrated
  useEffect(() => {
    const demo = setInterval(() => {
      setLines((prev) => [...prev, `Sample caption ${prev.length + 1}`]);
    }, 3000);
    return () => clearInterval(demo);
  }, []);

  return <Caption lines={lines} fontSizePx={18} />;
}

createRoot(mountNode).render(<RootApp />);

// background ping
chrome.runtime.sendMessage({ ping: "hello" });