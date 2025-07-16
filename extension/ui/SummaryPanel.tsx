import React from "react";

interface Props {
  summary: string;
  actions: string[];
}

export const SummaryPanel: React.FC<Props> = ({ summary, actions }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        padding: "8px 12px",
        maxWidth: "300px",
        fontSize: "14px",
        zIndex: 2147483647,
      }}
    >
      <h4 style={{ margin: "4px 0", fontWeight: 600 }}>Live Summary</h4>
      <p style={{ whiteSpace: "pre-wrap" }}>{summary || "(building…)"}</p>
      {actions.length > 0 && (
        <>
          <hr style={{ opacity: 0.3 }} />
          <h5 style={{ margin: "4px 0 2px" }}>Action Items</h5>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {actions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};