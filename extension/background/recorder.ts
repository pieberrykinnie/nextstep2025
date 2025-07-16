// extension/background/recorder.ts
// Purpose: service worker entrypoint for LimitlessMeet.

import { startTabAudioCapture } from "./audioCapture";

console.info("[LimitlessMeet] background service worker bootstrapped");

// Whisper worker setup
const worker = new Worker(new URL("../workers/whisperWorker.ts", import.meta.url), {
  type: "module",
});

worker.postMessage({ type: "init", wasmPath: chrome.runtime.getURL("dist/whisper.wasm") });

worker.onmessage = (e) => {
  if (e.data.type === "ready") {
    console.info("[LimitlessMeet] Whisper worker ready");
  } else if (e.data.type === "transcript") {
    chrome.runtime.sendMessage({ transcript: e.data.text });
  }
};

startTabAudioCapture((chunk) => {
  worker.postMessage({ type: "audio", pcm: chunk }, [chunk.buffer]);
}).catch((err) => console.error(err));