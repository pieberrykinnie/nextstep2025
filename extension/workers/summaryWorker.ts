// extension/workers/summaryWorker.ts
// Summary aggregation worker: buffers lines and periodically sends to TinyLLAMA summarizer.

// TODO: Replace dummy TinyLLAMA worker with real WASM integration.

const AGGREGATION_INTERVAL_MS = 30_000; // 30 seconds
const MAX_BUFFER_LINES = 40;

declare const self: DedicatedWorkerGlobalScope;

interface InitMsg { type: "init" }
interface TextMsg { type: "text"; lines: string[] }

// --- TinyLLAMA worker integration ---
let llamaWorker: Worker | null = null;
let llamaReady = false;

function initLlamaWorker() {
  if (llamaWorker) return;
  // In a real extension, use importScripts or Worker constructor with the correct path
  llamaWorker = new Worker("tinyllamaWorker.js"); // TODO: adjust path as needed
  llamaWorker.onmessage = (e) => {
    const data = e.data;
    if (data.type === "init") llamaReady = true;
    if (data.type === "summary") {
      // Forward summary result to main thread
      self.postMessage({ type: "summary", summary: data.summary, actions: data.actions });
    }
  };
  llamaWorker.postMessage({ type: "init" });
}

let buffer: string[] = [];
let timer: number | null = null;

function flushToLlama() {
  if (!llamaWorker || !llamaReady || buffer.length === 0) return;
  const text = buffer.slice(-MAX_BUFFER_LINES).join("\n");
  llamaWorker.postMessage({ type: "summarize", text });
  buffer = [];
}

function startTimer() {
  if (timer !== null) return;
  timer = setInterval(flushToLlama, AGGREGATION_INTERVAL_MS);
}

self.onmessage = (e) => {
  const data = e.data as InitMsg | TextMsg;
  if (data.type === "init") {
    initLlamaWorker();
    startTimer();
  } else if (data.type === "text") {
    buffer.push(...data.lines);
    if (buffer.length > MAX_BUFFER_LINES * 2) {
      buffer = buffer.slice(-MAX_BUFFER_LINES * 2);
    }
  }
};