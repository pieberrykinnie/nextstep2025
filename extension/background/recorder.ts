// extension/background/recorder.ts
// Purpose: service worker entrypoint for LimitlessMeet.

import { startTabAudioCapture } from "./audioCapture";

console.info("[LimitlessMeet] background service worker bootstrapped");

self.addEventListener("activate", () => {
  console.info("[LimitlessMeet] activated");
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.ping === "hello") {
    sendResponse({ pong: "world" });
    return true;
  }
});

// Auto-start capture for prototype (later tie to meeting detection)
startTabAudioCapture((chunk) => {
  console.debug("[LimitlessMeet] audio chunk", chunk.length);
}).catch((err) => {
  console.error("[LimitlessMeet] audio capture failed", err);
});