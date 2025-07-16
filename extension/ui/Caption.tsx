import React, { useEffect, useRef, useState, ChangeEvent } from "react";

export interface CaptionProps {
  lines: string[];
  fontSizePx?: number;
  maxLines?: number;
}

/**
 * Renders a scrollable, searchable list of caption lines with timeline scrollback.
 */
export const Caption: React.FC<CaptionProps> = ({ lines, fontSizePx = 16, maxLines = 4 }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [isUserScrolled, setIsUserScrolled] = useState(false);

  // Auto-scroll to bottom unless user has scrolled up
  useEffect(() => {
    if (!isUserScrolled) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines, isUserScrolled]);

  // Handle user scroll to enable/disable auto-scroll
  const onScroll = () => {
    const area = scrollAreaRef.current;
    if (!area) return;
    const atBottom = area.scrollHeight - area.scrollTop - area.clientHeight < 8;
    setIsUserScrolled(!atBottom);
  };

  // Filter and highlight lines based on search
  const filteredLines = search
    ? lines.filter((l) => l.toLowerCase().includes(search.toLowerCase()))
    : lines;

  const highlight = (text: string, term: string) => {
    if (!term) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} style={{ background: "#ffe066", color: "#222", padding: 0 }}>{part}</mark>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      )
    );
  };

  // Keyboard accessibility: focus search on /, escape to clear
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        setSearch("");
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <section
      className="limitlessmeet-caption shadow-lg rounded text-white"
      aria-label="Captions timeline"
      style={{
        fontSize: `${fontSizePx}px`,
        background: "rgba(0,0,0,0.75)",
        padding: "4px 8px 8px 8px",
        maxWidth: "100%",
        lineHeight: 1.35,
        width: 420,
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 2147483647,
      }}
    >
      <label htmlFor="caption-search" style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
        Search captions
      </label>
      <input
        id="caption-search"
        ref={searchInputRef}
        type="text"
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        placeholder="Type to search… (press / to focus)"
        aria-label="Search captions"
        style={{
          width: "100%",
          padding: "4px 8px",
          borderRadius: 4,
          border: "1px solid #ccc",
          marginBottom: 8,
          color: "#222",
          fontSize: fontSizePx * 0.95,
        }}
      />
      <div
        ref={scrollAreaRef}
        onScroll={onScroll}
        tabIndex={0}
        role="log"
        aria-live="polite"
        aria-label="Caption timeline scrollback"
        style={{
          maxHeight: 240,
          overflowY: "auto",
          outline: "none",
          background: "rgba(0,0,0,0.1)",
          padding: 2,
          borderRadius: 4,
        }}
      >
        {filteredLines.length === 0 ? (
          <div style={{ opacity: 0.7, fontStyle: "italic" }}>No captions found.</div>
        ) : (
          filteredLines.map((l, idx) => (
            <div key={idx} style={{ marginBottom: 2 }}>
              {highlight(l, search)}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </section>
  );
};