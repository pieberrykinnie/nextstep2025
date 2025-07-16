import React, { useEffect, useRef } from "react";

export interface CaptionProps {
  lines: string[];
  fontSizePx?: number;
  maxLines?: number;
}

/**
 * Renders a scrolling list of caption lines.
 */
export const Caption: React.FC<CaptionProps> = ({ lines, fontSizePx = 16, maxLines = 4 }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom on new line
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const displayed = lines.slice(-maxLines);

  return (
    <div
      className="limitlessmeet-caption shadow-lg rounded text-white"
      style={{
        fontSize: `${fontSizePx}px`,
        background: "rgba(0,0,0,0.75)",
        padding: "4px 8px",
        maxWidth: "100%",
        lineHeight: 1.35,
      }}
    >
      {displayed.map((l, idx) => (
        <div key={idx}>{l}</div>
      ))}
      <div ref={endRef} />
    </div>
  );
};