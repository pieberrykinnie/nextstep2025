// extension/content/inject.tsx
// Injects the LimitlessMeet root container into the page and mounts React UI

import React from "react";
import { createRoot } from "react-dom/client";

const ROOT_ID = "limitlessmeet-root";

function ensureRoot() {
  if (document.getElementById(ROOT_ID)) return;
  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.style.all = "initial"; // isolate basics
  document.documentElement.appendChild(root);
  console.debug("[LimitlessMeet] root injected");
}

ensureRoot();

function RootApp() {
  return (
    <div style={{ padding: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '14px' }}>
      Hello LimitlessMeet
    </div>
  );
}

const mountNode = document.getElementById(ROOT_ID)!;
createRoot(mountNode).render(<RootApp />);

// Example ping to background
chrome.runtime.sendMessage({ ping: "hello" }, (resp) => {
  console.debug("[LimitlessMeet] background replied", resp);
});