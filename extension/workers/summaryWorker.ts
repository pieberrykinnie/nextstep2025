// extension/workers/summaryWorker.ts
// TinyLLAMA summariser worker placeholder.

// As actual TinyLLAMA wasm is heavy, we stub summariser returning last N sentences summarised.

declare const self: DedicatedWorkerGlobalScope;

interface InitMsg { type: "init" }
interface TextMsg { type: "text"; lines: string[] }

self.onmessage = (e) => {
  const data = e.data as InitMsg | TextMsg;
  if (data.type === "text") {
    const joined = data.lines.slice(-10).join(" ");
    const summary = joined.split(".").slice(0, 2).join(".") + ".";
    // naive action extraction: lines containing "will" or "todo"
    const actions = data.lines.filter((l) => /\b(will|todo)\b/i.test(l));
    self.postMessage({ type: "summary", summary, actions });
  }
};