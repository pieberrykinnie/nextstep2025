import React from "react";

interface Props {
  summary: string;
  actions: string[];
}

export const SummaryPanel: React.FC<Props> = ({ summary, actions }) => {
  return (
    <aside
      aria-label="Meeting summary and action items"
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        padding: 0,
        maxWidth: 520,
        minWidth: 240,
        fontSize: 14,
        zIndex: 2147483647,
        borderRadius: 8,
        boxShadow: "0 2px 12px #0008",
        display: "flex",
        flexDirection: "row",
        gap: 0,
        overflow: "hidden",
      }}
    >
      <section
        aria-label="Live summary"
        style={{
          flex: 1,
          minWidth: 0,
          padding: "12px 16px 12px 12px",
          borderRight: actions.length > 0 ? "1px solid #444" : undefined,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h4 style={{ margin: "4px 0 8px", fontWeight: 600, fontSize: 15 }}>Live Summary</h4>
        <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{summary || "(building…)"}</p>
      </section>
      {actions.length > 0 && (
        <section
          aria-label="Action items"
          style={{
            flex: 1,
            minWidth: 0,
            padding: "12px 16px 12px 12px",
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h5 style={{ margin: "4px 0 8px", fontWeight: 600, fontSize: 15 }}>Action Items</h5>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {actions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>
      )}
      <style>{`
        @media (max-width: 600px) {
          .limitlessmeet-summarypanel {
            flex-direction: column !important;
            min-width: 0 !important;
            max-width: 98vw !important;
          }
          .limitlessmeet-summarypanel section {
            border-right: none !important;
            border-bottom: 1px solid #444 !important;
          }
        }
      `}</style>
    </aside>
  );
};