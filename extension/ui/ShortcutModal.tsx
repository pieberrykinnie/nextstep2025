import React, { useState, useRef, useEffect } from "react";

interface Shortcut {
  key: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  action: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  shortcuts: Shortcut[];
  onAdd: (s: Shortcut) => void;
  onRemove: (idx: number) => void;
}

export const ShortcutModal: React.FC<Props> = ({ open, onClose, shortcuts, onAdd, onRemove }) => {
  const [recording, setRecording] = useState(false);
  const [pending, setPending] = useState<Partial<Shortcut>>({});
  const [action, setAction] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => modalRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!recording) return;
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === "Escape") {
        setRecording(false);
        setPending({});
        return;
      }
      if (e.key.length === 1 || e.code.startsWith("Key") || e.code.startsWith("Digit")) {
        setPending({
          key: e.key.toUpperCase(),
          ctrl: e.ctrlKey,
          alt: e.altKey,
          shift: e.shiftKey,
        });
        setRecording(false);
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [recording]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shortcut mapping"
      tabIndex={-1}
      ref={modalRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onKeyDown={e => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        style={{
          background: "#222",
          color: "#fff",
          borderRadius: 8,
          minWidth: 340,
          maxWidth: 420,
          padding: 24,
          boxShadow: "0 2px 16px #000a",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Keyboard Shortcuts</h2>
        <ul style={{ paddingLeft: 18 }}>
          {shortcuts.length === 0 && <li style={{ opacity: 0.7 }}>No shortcuts mapped.</li>}
          {shortcuts.map((s, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              <kbd style={{ background: "#444", borderRadius: 3, padding: "2px 6px", marginRight: 6 }}>
                {s.ctrl && "Ctrl+"}{s.alt && "Alt+"}{s.shift && "Shift+"}{s.key}
              </kbd>
              → {s.action}
              <button
                aria-label={`Remove shortcut for ${s.action}`}
                style={{ marginLeft: 8, background: "#900", color: "#fff", border: "none", borderRadius: 3, padding: "2px 6px", cursor: "pointer" }}
                onClick={() => onRemove(i)}
              >Remove</button>
            </li>
          ))}
        </ul>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (pending.key && action) {
              onAdd({
                key: pending.key,
                ctrl: !!pending.ctrl,
                alt: !!pending.alt,
                shift: !!pending.shift,
                action,
              } as Shortcut);
              setPending({});
              setAction("");
            }
          }}
          style={{ marginTop: 16 }}
        >
          {/* WebHID integration stub */}
          <div style={{ marginBottom: 12 }}>
            <button
              type="button"
              onClick={async () => {
                if ((navigator as any).hid) {
                  try {
                    const devices = await (navigator as any).hid.requestDevice({ filters: [] });
                    // eslint-disable-next-line no-console
                    console.log("HID devices:", devices);
                    alert("HID device(s) connected. See console for details.");
                  } catch (e) {
                    alert("HID connection cancelled or failed.");
                  }
                } else {
                  alert("WebHID is not supported in this browser.");
                }
              }}
              style={{ marginBottom: 8 }}
            >
              Connect HID Device
            </button>
          </div>
          <label htmlFor="shortcut-action">Action</label>
          <input
            id="shortcut-action"
            ref={inputRef}
            type="text"
            value={action}
            onChange={e => setAction(e.target.value)}
            placeholder="e.g. Mute"
            style={{ width: "60%", marginLeft: 8, marginBottom: 8 }}
            required
          />
          <div style={{ marginBottom: 8 }}>
            <button
              type="button"
              onClick={() => setRecording(true)}
              style={{ marginRight: 8 }}
            >
              {recording ? "Press shortcut…" : "Record shortcut"}
            </button>
            {pending.key && (
              <span>
                <kbd style={{ background: "#444", borderRadius: 3, padding: "2px 6px" }}>
                  {pending.ctrl && "Ctrl+"}{pending.alt && "Alt+"}{pending.shift && "Shift+"}{pending.key}
                </kbd>
              </span>
            )}
          </div>
          <button type="submit" disabled={!pending.key || !action}>
            Add Shortcut
          </button>
          <button type="button" onClick={onClose} style={{ marginLeft: 12 }}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};