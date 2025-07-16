// extension/background/recorder.ts
// Purpose: service worker entrypoint for LimitlessMeet.

import { startTabAudioCapture } from "./audioCapture";

console.info("[LimitlessMeet] background service worker bootstrapped");

// Whisper worker setup
const whisperWorker = new Worker(new URL("../workers/whisperWorker.ts", import.meta.url), {
  type: "module",
});

whisperWorker.postMessage({ type: "init", wasmPath: chrome.runtime.getURL("dist/whisper.wasm") });

const summaryWorker = new Worker(new URL("../workers/summaryWorker.ts", import.meta.url), {
  type: "module",
});

let transcriptLines: string[] = [];

// Send to summary worker every 30s
setInterval(() => {
  if (transcriptLines.length === 0) return;
  summaryWorker.postMessage({ type: "text", lines: transcriptLines });
}, 30000);

summaryWorker.onmessage = (e) => {
  if (e.data.type === "summary") {
    chrome.runtime.sendMessage({ summary: e.data.summary, actions: e.data.actions });
  }
};

whisperWorker.onmessage = (e) => {
  if (e.data.type === "ready") {
    console.info("[LimitlessMeet] Whisper worker ready");
  } else if (e.data.type === "transcript") {
    transcriptLines.push(e.data.text);
    chrome.runtime.sendMessage({ transcript: e.data.text });
  }
};

startTabAudioCapture((chunk) => {
  whisperWorker.postMessage({ type: "audio", pcm: chunk }, [chunk.buffer]);
}).catch(console.error);