// extension/content/inject.tsx
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Caption } from "../ui/Caption";
import { SummaryPanel } from "../ui/SummaryPanel";
import { ShortcutModal } from "../ui/ShortcutModal";
import { SettingsModal } from "../ui/SettingsModal";

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
  const [shortcutModalOpen, setShortcutModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [shortcuts, setShortcuts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("limitlessmeet.shortcuts") || "[]");
    } catch {
      return [];
    }
  });
  const [storageWorker, setStorageWorker] = useState<Worker | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>({
    accessibility: { highContrast: false, dyslexiaFont: false, fontSize: 18 },
  });

  // Initialize storage worker
  useEffect(() => {
    const worker = new Worker("storageWorker.js"); // TODO: adjust path as needed
    worker.onmessage = (e) => {
      const { type, session, sessionId: id, error } = e.data;
      if (type === "loaded" && session) {
        setLines(session.captions || []);
        setSummary(session.summary || "");
        setActions(session.actions || []);
        setSessionId(session.id);
      } else if (type === "saved") {
        setSessionId(id);
      } else if (type === "error") {
        console.error("Storage error:", error);
      }
    };
    setStorageWorker(worker);
    
    // Load previous session
    worker.postMessage({ type: "load" });
    
    return () => worker.terminate();
  }, []);

  // Auto-save session data every 30 seconds
  useEffect(() => {
    if (!storageWorker) return;
    
    const interval = setInterval(() => {
      storageWorker.postMessage({
        type: "save",
        data: {
          captions: lines,
          summary,
          actions,
        },
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, [storageWorker, lines, summary, actions]);

  useEffect(() => {
    localStorage.setItem("limitlessmeet.shortcuts", JSON.stringify(shortcuts));
  }, [shortcuts]);

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
      // Check mapped shortcuts
      shortcuts.forEach((s: any) => {
        if (
          s.key === e.key.toUpperCase() &&
          !!s.ctrl === e.ctrlKey &&
          !!s.alt === e.altKey &&
          !!s.shift === e.shiftKey
        ) {
          // Demo: if action is 'Mute', alert; if 'Toggle Captions', toggle
          if (s.action.toLowerCase().includes("mute")) {
            alert("Mute shortcut triggered!");
          } else if (s.action.toLowerCase().includes("caption")) {
            setShowCaptions((prev) => !prev);
          }
        }
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcuts]);

  useEffect(() => {
    chrome.storage.sync.get(["limitlessmeet_settings"], (result) => {
      if (result.limitlessmeet_settings) {
        setSettings(result.limitlessmeet_settings);
      }
    });
  }, []);

  return (
    <>
      <div style={{ position: "fixed", top: 10, left: 10, zIndex: 2147483647, display: "flex", gap: 8 }}>
        <button
          onClick={() => setShortcutModalOpen(true)}
          style={{ background: "#222", color: "#fff", border: "none", borderRadius: 4, padding: "6px 12px", fontSize: 14 }}
          aria-label="Open shortcut settings"
        >
          Shortcuts
        </button>
        <button
          onClick={() => setSettingsModalOpen(true)}
          style={{ background: "#007bff", color: "#fff", border: "none", borderRadius: 4, padding: "6px 12px", fontSize: 14 }}
          aria-label="Open settings"
        >
          Settings
        </button>
      </div>
      <ShortcutModal
        open={shortcutModalOpen}
        onClose={() => setShortcutModalOpen(false)}
        shortcuts={shortcuts}
        onAdd={s => setShortcuts((prev: any) => [...prev, s])}
        onRemove={idx => setShortcuts((prev: any) => prev.filter((_: any, i: number) => i !== idx))}
      />
      <SettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
      {showCaptions && (
        <Caption
          lines={lines}
          fontSizePx={settings.accessibility.fontSize}
          highContrast={settings.accessibility.highContrast}
          dyslexiaFont={settings.accessibility.dyslexiaFont}
        />
      )}
      <SummaryPanel summary={summary} actions={actions} captions={lines} />
    </>
  );
}

createRoot(mountNode).render(<RootApp />);

chrome.runtime.sendMessage({ ping: "hello" });