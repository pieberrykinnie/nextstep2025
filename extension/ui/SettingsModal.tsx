// extension/ui/SettingsModal.tsx
import React, { useState, useEffect } from "react";

interface Settings {
  general: {
    autoStart: boolean;
    exportFormat: "markdown" | "html" | "pdf";
    sessionTimeout: number;
  };
  accessibility: {
    highContrast: boolean;
    dyslexiaFont: boolean;
    fontSize: number;
    captionPosition: "top" | "bottom" | "left" | "right";
  };
  shortcuts: {
    toggleCaptions: string;
    toggleSummary: string;
    exportSession: string;
    muteUnmute: string;
  };
}

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"general" | "accessibility" | "shortcuts">("general");
  const [settings, setSettings] = useState<Settings>({
    general: {
      autoStart: true,
      exportFormat: "markdown",
      sessionTimeout: 30,
    },
    accessibility: {
      highContrast: false,
      dyslexiaFont: false,
      fontSize: 18,
      captionPosition: "bottom",
    },
    shortcuts: {
      toggleCaptions: "Ctrl+Alt+C",
      toggleSummary: "Ctrl+Alt+S",
      exportSession: "Ctrl+Alt+E",
      muteUnmute: "Ctrl+Alt+M",
    },
  });

  // Load settings from chrome.storage.sync
  useEffect(() => {
    chrome.storage.sync.get(["limitlessmeet_settings"], (result) => {
      if (result.limitlessmeet_settings) {
        setSettings(result.limitlessmeet_settings);
      }
    });
  }, []);

  // Save settings to chrome.storage.sync
  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    chrome.storage.sync.set({ limitlessmeet_settings: newSettings });
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2147483646,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 24,
          width: "90%",
          maxWidth: 600,
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>LimitlessMeet Settings</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              padding: 4,
            }}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", borderBottom: "1px solid #e0e0e0", marginBottom: 24 }}>
          {[
            { key: "general", label: "General" },
            { key: "accessibility", label: "Accessibility" },
            { key: "shortcuts", label: "Shortcuts" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                background: "none",
                border: "none",
                padding: "12px 24px",
                cursor: "pointer",
                borderBottom: activeTab === tab.key ? "2px solid #007bff" : "2px solid transparent",
                color: activeTab === tab.key ? "#007bff" : "#666",
                fontWeight: activeTab === tab.key ? 600 : 400,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: 300 }}>
          {activeTab === "general" && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>General Settings</h3>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={settings.general.autoStart}
                    onChange={(e) =>
                      saveSettings({
                        ...settings,
                        general: { ...settings.general, autoStart: e.target.checked },
                      })
                    }
                    style={{ marginRight: 8 }}
                  />
                  Auto-start captions when joining a meeting
                </label>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8 }}>
                  Export Format:
                  <select
                    value={settings.general.exportFormat}
                    onChange={(e) =>
                      saveSettings({
                        ...settings,
                        general: { ...settings.general, exportFormat: e.target.value as any },
                      })
                    }
                    style={{ marginLeft: 8, padding: "4px 8px" }}
                  >
                    <option value="markdown">Markdown</option>
                    <option value="html">HTML</option>
                    <option value="pdf">PDF</option>
                  </select>
                </label>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8 }}>
                  Session Timeout (minutes):
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={settings.general.sessionTimeout}
                    onChange={(e) =>
                      saveSettings({
                        ...settings,
                        general: { ...settings.general, sessionTimeout: parseInt(e.target.value) },
                      })
                    }
                    style={{ marginLeft: 8, padding: "4px 8px", width: 80 }}
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === "accessibility" && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>Accessibility Settings</h3>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={settings.accessibility.highContrast}
                    onChange={(e) =>
                      saveSettings({
                        ...settings,
                        accessibility: { ...settings.accessibility, highContrast: e.target.checked },
                      })
                    }
                    style={{ marginRight: 8 }}
                  />
                  High contrast mode
                </label>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={settings.accessibility.dyslexiaFont}
                    onChange={(e) =>
                      saveSettings({
                        ...settings,
                        accessibility: { ...settings.accessibility, dyslexiaFont: e.target.checked },
                      })
                    }
                    style={{ marginRight: 8 }}
                  />
                  Use dyslexia-friendly font (OpenDyslexic)
                </label>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8 }}>
                  Caption Font Size (px):
                  <input
                    type="range"
                    min="12"
                    max="32"
                    value={settings.accessibility.fontSize}
                    onChange={(e) =>
                      saveSettings({
                        ...settings,
                        accessibility: { ...settings.accessibility, fontSize: parseInt(e.target.value) },
                      })
                    }
                    style={{ marginLeft: 8, width: 200 }}
                  />
                  <span style={{ marginLeft: 8 }}>{settings.accessibility.fontSize}px</span>
                </label>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8 }}>
                  Caption Position:
                  <select
                    value={settings.accessibility.captionPosition}
                    onChange={(e) =>
                      saveSettings({
                        ...settings,
                        accessibility: { ...settings.accessibility, captionPosition: e.target.value as any },
                      })
                    }
                    style={{ marginLeft: 8, padding: "4px 8px" }}
                  >
                    <option value="bottom">Bottom</option>
                    <option value="top">Top</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {activeTab === "shortcuts" && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>Keyboard Shortcuts</h3>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8 }}>
                  Toggle Captions:
                  <input
                    type="text"
                    value={settings.shortcuts.toggleCaptions}
                    onChange={(e) =>
                      saveSettings({
                        ...settings,
                        shortcuts: { ...settings.shortcuts, toggleCaptions: e.target.value },
                      })
                    }
                    style={{ marginLeft: 8, padding: "4px 8px", width: 150 }}
                    placeholder="Ctrl+Alt+C"
                  />
                </label>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8 }}>
                  Toggle Summary Panel:
                  <input
                    type="text"
                    value={settings.shortcuts.toggleSummary}
                    onChange={(e) =>
                      saveSettings({
                        ...settings,
                        shortcuts: { ...settings.shortcuts, toggleSummary: e.target.value },
                      })
                    }
                    style={{ marginLeft: 8, padding: "4px 8px", width: 150 }}
                    placeholder="Ctrl+Alt+S"
                  />
                </label>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8 }}>
                  Export Session:
                  <input
                    type="text"
                    value={settings.shortcuts.exportSession}
                    onChange={(e) =>
                      saveSettings({
                        ...settings,
                        shortcuts: { ...settings.shortcuts, exportSession: e.target.value },
                      })
                    }
                    style={{ marginLeft: 8, padding: "4px 8px", width: 150 }}
                    placeholder="Ctrl+Alt+E"
                  />
                </label>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8 }}>
                  Mute/Unmute:
                  <input
                    type="text"
                    value={settings.shortcuts.muteUnmute}
                    onChange={(e) =>
                      saveSettings({
                        ...settings,
                        shortcuts: { ...settings.shortcuts, muteUnmute: e.target.value },
                      })
                    }
                    style={{ marginLeft: 8, padding: "4px 8px", width: 150 }}
                    placeholder="Ctrl+Alt+M"
                  />
                </label>
              </div>

              <div style={{ 
                backgroundColor: "#f8f9fa", 
                padding: 12, 
                borderRadius: 4, 
                fontSize: 14,
                color: "#666"
              }}>
                <strong>Note:</strong> Shortcuts are global and will work even when the meeting tab is not focused.
                Use Ctrl, Alt, and Shift modifiers as needed.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ 
          display: "flex", 
          justifyContent: "flex-end", 
          gap: 12, 
          marginTop: 24,
          borderTop: "1px solid #e0e0e0",
          paddingTop: 16
        }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              border: "1px solid #ccc",
              borderRadius: 4,
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}